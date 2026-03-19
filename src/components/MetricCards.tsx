import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { ChartDataPoint } from "@/app/page";

interface MetricCardsProps {
  data: ChartDataPoint[];
  isLoading: boolean;
}

interface Metrics {
  avgActual: number | null;
  avgForecast: number | null;
  meanError: number | null;
  peakActual: number | null;
}

function computeMetrics(data: ChartDataPoint[]): Metrics {
  if (data.length === 0) {
    return { avgActual: null, avgForecast: null, meanError: null, peakActual: null };
  }

  const actuals = data
    .map((d) => d.actual)
    .filter((v): v is number => v !== null);

  const forecastPairs = data.filter(
    (d): d is { time: string; actual: number; forecast: number } =>
      d.actual !== null && d.forecast !== null
  );

  const avgActual =
    actuals.length > 0
      ? actuals.reduce((a, b) => a + b, 0) / actuals.length
      : null;

  const avgForecast =
    forecastPairs.length > 0
      ? forecastPairs.reduce((a, b) => a + b.forecast, 0) / forecastPairs.length
      : null;

  const meanError =
    forecastPairs.length > 0
      ? forecastPairs.reduce((a, b) => a + (b.forecast - b.actual), 0) /
        forecastPairs.length
      : null;

  const peakActual = actuals.length > 0 ? Math.max(...actuals) : null;

  return { avgActual, avgForecast, meanError, peakActual };
}

function formatMW(value: number | null): string {
  if (value === null) return "--";
  return `${(value / 1000).toFixed(2)} GW`;
}

function formatError(value: number | null): string {
  if (value === null) return "--";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value / 1000).toFixed(2)} GW`;
}

interface CardConfig {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  glowColor: string;
}

export default function MetricCards({ data, isLoading }: MetricCardsProps) {
  const metrics = computeMetrics(data);

  const errorIsPositive =
    metrics.meanError !== null && metrics.meanError >= 0;

  const cards: CardConfig[] = [
    {
      title: "Avg Actual",
      value: formatMW(metrics.avgActual),
      subtitle: "Mean generation over period",
      icon: <Activity className="h-4 w-4" />,
      accent: "text-blue-400",
      glowColor: "rgba(59,130,246,0.15)",
    },
    {
      title: "Avg Forecast",
      value: formatMW(metrics.avgForecast),
      subtitle: "Mean forecasted generation",
      icon: <TrendingUp className="h-4 w-4" />,
      accent: "text-emerald-400",
      glowColor: "rgba(16,185,129,0.15)",
    },
    {
      title: "Mean Error",
      value: formatError(metrics.meanError),
      subtitle: "Forecast minus actual (bias)",
      icon:
        errorIsPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        ),
      accent: errorIsPositive ? "text-amber-400" : "text-emerald-400",
      glowColor: errorIsPositive
        ? "rgba(251,191,36,0.15)"
        : "rgba(16,185,129,0.15)",
    },
    {
      title: "Peak Actual",
      value: formatMW(metrics.peakActual),
      subtitle: "Highest recorded in period",
      icon: <Zap className="h-4 w-4" />,
      accent: "text-purple-400",
      glowColor: "rgba(168,85,247,0.15)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
  key={card.title}
  className="glass rounded-xl transition-all-smooth hover:bg-white/[0.07] group"
  style={{ padding: "1.25rem" }}
  onMouseEnter={(e) => {
    (e.currentTarget as HTMLDivElement).style.boxShadow =
      `0 0 20px ${card.glowColor}`;
  }}
  onMouseLeave={(e) => {
    (e.currentTarget as HTMLDivElement).style.boxShadow =
      `0 0 0 0 ${card.glowColor}`;
  }}
>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
              {card.title}
            </span>
            <span className={`${card.accent} opacity-70`}>{card.icon}</span>
          </div>
          {isLoading ? (
            <div className="h-7 w-24 rounded bg-white/10 animate-pulse" />
          ) : (
            <p className={`text-xl font-bold tracking-tight ${card.accent}`}>
              {card.value}
            </p>
          )}
          <p className="text-xs text-white/30 mt-1.5">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}