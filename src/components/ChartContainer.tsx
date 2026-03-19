"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ChartDataPoint } from "@/app/page";

interface ChartContainerProps {
  data: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
}

function formatXAxisTick(timeStr: string): string {
  try {
    return format(parseISO(timeStr), "MMM dd, HH:mm");
  } catch {
    return timeStr;
  }
}

interface TooltipPayloadEntry {
  name: string;
  value: number | null;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  let formattedLabel = label ?? "";
  try {
    formattedLabel = format(parseISO(label ?? ""), "MMM dd yyyy, HH:mm 'UTC'");
  } catch {
    formattedLabel = label ?? "";
  }

  return (
    <div
      className="glass-strong rounded-xl px-4 py-3 text-xs"
      style={{ minWidth: 180, padding: "0.875rem 1rem" }}
    >
      <p className="text-white/50 mb-2 font-medium">{formattedLabel}</p>
      {payload.map((entry) => {
        const isActual = entry.name === "actual";
        const label = isActual ? "Actual" : "Forecast";
        const color = isActual ? "#3b82f6" : "#10b981";
        const display =
          entry.value !== null && entry.value !== undefined
            ? `${entry.value.toLocaleString()} MW`
            : "No data";
        return (
          <div key={entry.name} className="flex items-center justify-between gap-6 py-0.5">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-white/60">{label}</span>
            </div>
            <span className="font-semibold" style={{ color }}>
              {display}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LegendContent() {
  return (
    <div className="flex items-center justify-end gap-5 px-2 pb-1 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-6 h-0.5 rounded-full bg-blue-500" />
        <span className="text-white/50">Actual Generation</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-6 h-0.5 rounded-full bg-emerald-500" />
        <span className="text-white/50">Forecast</span>
      </div>
    </div>
  );
}

function PulseLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div
        className="w-16 h-16 rounded-full border border-blue-500/30 animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)",
        }}
      />
      <p className="text-sm text-white/30 animate-pulse">Fetching wind data...</p>
    </div>
  );
}

export default function ChartContainer({ data, isLoading, error }: ChartContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pointCount = data.length;
  const subtitle = isLoading
    ? "Fetching data from Elexon BMRS API..."
    : error
    ? "Failed to load data"
    : pointCount > 0
    ? `${pointCount.toLocaleString()} data points loaded`
    : "No data loaded";

  return (
    <div
      className="glass rounded-xl overflow-hidden"
      style={{
        boxShadow: "0 -2px 0 0 rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.05)",
      }}
    >
      <div className="flex items-start justify-between" style={{ padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
        <div>
          <h2 className="text-sm font-semibold text-white/80 tracking-tight">
            Wind Power Generation — Actual vs Forecast
          </h2>
          <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="w-full h-72 sm:h-96 lg:h-[420px]" style={{ padding: "0 1.25rem 1.25rem 1.25rem" }}>
        {!mounted || isLoading ? (
          <PulseLoader />
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-red-400">Error: {error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <p className="text-sm text-white/40">
              No data available for this date range
            </p>
            <p className="text-xs text-white/20">
              Try selecting a different date range or adjusting the forecast horizon
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff10"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tickFormatter={formatXAxisTick}
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={80}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}GW`}
                width={40}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
              />

              <Legend content={<LegendContent />} verticalAlign="top" />

              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gradActual)"
                dot={false}
                name="actual"
                connectNulls={false}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />

              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradForecast)"
                dot={false}
                name="forecast"
                connectNulls={true}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}