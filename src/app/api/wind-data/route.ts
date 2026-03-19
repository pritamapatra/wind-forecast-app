import { NextRequest, NextResponse } from "next/server";

const ELEXON_BASE = "https://data.elexon.co.uk/bmrs/api/v1";
const MIN_SETTLEMENT_DATE = "2025-01-01";

interface WindForecastRecord {
  publishTime: string;
  startTime: string;
  generation: number;
}

interface FuelHHRecord {
  publishTime: string;
  startTime: string;
  settlementDate: string;
  fuelType: string;
  generation: number;
}

export interface CombinedDataPoint {
  time: string;
  actual: number | null;
  forecast: number | null;
}

function toDateOnly(isoString: string): string {
  return isoString.slice(0, 10);
}

function subtractHours(isoString: string, hours: number): string {
  const date = new Date(isoString);
  date.setTime(date.getTime() - hours * 60 * 60 * 1000);
  return date.toISOString();
}

async function fetchActuals(from: string, to: string): Promise<FuelHHRecord[]> {
  const settlementDateFrom = toDateOnly(from) < MIN_SETTLEMENT_DATE
    ? MIN_SETTLEMENT_DATE
    : toDateOnly(from);
  const settlementDateTo = toDateOnly(to);

  const url =
    `${ELEXON_BASE}/datasets/FUELHH/stream` +
    `?settlementDateFrom=${settlementDateFrom}` +
    `&settlementDateTo=${settlementDateTo}` +
    `&fuelType=WIND`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`FUELHH fetch failed: ${res.status}`);
  }

  const data: FuelHHRecord[] = await res.json();
  return data.filter(
    (r) => r.startTime >= from && r.startTime <= to
  );
}


async function fetchForecasts(
  from: string,
  to: string
): Promise<WindForecastRecord[]> {
  const publishFrom = subtractHours(from, 48);

  const url =
    `${ELEXON_BASE}/datasets/WINDFOR/stream` +
    `?publishDateTimeFrom=${publishFrom}` +
    `&publishDateTimeTo=${to}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`WINDFOR fetch failed: ${res.status}`);
  }

  const data: WindForecastRecord[] = await res.json();
  return data.filter(
    (r) => r.startTime >= from && r.startTime <= to
  );
}

function applyHorizonFilter(
  forecasts: WindForecastRecord[],
  horizonHours: number
): Map<string, number> {
  const horizonMs = horizonHours * 60 * 60 * 1000;

  const grouped = new Map<string, WindForecastRecord[]>();
  for (const record of forecasts) {
    const existing = grouped.get(record.startTime) ?? [];
    existing.push(record);
    grouped.set(record.startTime, existing);
  }

  const result = new Map<string, number>();

  for (const [startTime, records] of grouped) {
    const startMs = new Date(startTime).getTime();

    const valid = records.filter((r) => {
      const publishMs = new Date(r.publishTime).getTime();
      const horizonDiff = startMs - publishMs;
      return horizonDiff >= horizonMs && horizonDiff <= 48 * 60 * 60 * 1000;
    });

    if (valid.length === 0) continue;

    valid.sort(
      (a, b) =>
        new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
    );

    result.set(startTime, valid[0].generation);
  }

  return result;
}

function combineData(
  actuals: FuelHHRecord[],
  forecastMap: Map<string, number>
): CombinedDataPoint[] {
  actuals.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return actuals.map((actual) => {
    const hourAligned = actual.startTime.slice(0, 14) + "00:00Z";
    const forecastValue = forecastMap.get(hourAligned) ?? null;

    return {
      time: actual.startTime,
      actual: actual.generation,
      forecast: forecastValue,
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const horizon = parseInt(searchParams.get("horizon") || "4", 10);

  if (!from || !to) {
    return NextResponse.json(
      { error: "from and to query params are required" },
      { status: 400 }
    );
  }

  const effectiveFrom = from < "2025-01-01T00:00:00Z" ? "2025-01-01T00:00:00Z" : from;

  try {
    const [actuals, forecasts] = await Promise.all([
      fetchActuals(effectiveFrom, to),
      fetchForecasts(effectiveFrom, to),
    ]);

    const forecastMap = applyHorizonFilter(forecasts, horizon);
    const combined = combineData(actuals, forecastMap);

    return NextResponse.json(combined);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}