"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import MetricCards from "@/components/MetricCards";
import ControlPanel from "@/components/ControlPanel";
import ChartContainer from "@/components/ChartContainer";
import Footer from "@/components/Footer";

export interface ChartDataPoint {
  time: string;
  actual: number | null;
  forecast: number | null;
}

export default function Home() {
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-01-03");
  const [horizon, setHorizon] = useState<number>(4);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async (from: string, to: string, h: number) => {
    if (!from || !to) return;
    if (new Date(to) < new Date(from)) return;

    setIsLoading(true);
    setError(null);

    try {
      const fromISO = `${from}T00:00:00Z`;
      const toISO = `${to}T23:59:59Z`;
      const url = `/api/wind-data?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}&horizon=${h}`;

      const res = await fetch(url);

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || `HTTP error ${res.status}`);
      }

      const data: ChartDataPoint[] = await res.json();
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchData(startDate, endDate, horizon);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [startDate, endDate, horizon, fetchData]);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}>
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start" style={{ margin: "0 2rem" }}>
  <div className="flex flex-col gap-6 flex-1 min-w-0">
    <MetricCards data={chartData} isLoading={isLoading} />
    <ChartContainer
      data={chartData}
      isLoading={isLoading}
      error={error}
    />
  </div>
  <div className="w-full lg:w-80 flex-shrink-0" style={{ marginRight: "-9rem" }}>
    <ControlPanel
      startDate={startDate}
      endDate={endDate}
      horizon={horizon}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onHorizonChange={setHorizon}
    />
  </div>
</div>
      </main>
      <Footer />
    </div>
  );
}