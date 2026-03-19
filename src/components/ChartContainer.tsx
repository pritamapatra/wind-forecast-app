"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const PLACEHOLDER_DATA = [
  { time: "00:00", actual: 4200, forecast: 4000 },
  { time: "00:30", actual: 4300, forecast: 4100 },
  { time: "01:00", actual: 4100, forecast: 4200 },
  { time: "01:30", actual: 3900, forecast: 4150 },
  { time: "02:00", actual: 4000, forecast: 3950 },
  { time: "02:30", actual: 4400, forecast: 4100 },
  { time: "03:00", actual: 4600, forecast: 4300 },
];

export default function ChartContainer() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">
          Wind Generation: Actual vs Forecast
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Placeholder data — live Elexon API data will replace this in Phase 2
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 sm:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={PLACEHOLDER_DATA}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `${v} MW`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} MW`,
                  name === "actual" ? "Actual Generation" : "Forecast",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="actual"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}