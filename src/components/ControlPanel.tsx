"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X, GripHorizontal } from "lucide-react";

interface ControlPanelProps {
  startDate: string;
  endDate: string;
  horizon: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onHorizonChange: (value: number) => void;
}

function PanelContent({
  startDate,
  endDate,
  horizon,
  onStartDateChange,
  onEndDateChange,
  onHorizonChange,
}: ControlPanelProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="start-date-input"
            className="text-xs font-medium text-white/50 uppercase tracking-wider"
          >
            Start Date
          </label>
          <input
            id="start-date-input"
            type="date"
            value={startDate}
            min="2025-01-01"
            max={endDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="end-date-input"
            className="text-xs font-medium text-white/50 uppercase tracking-wider"
          >
            End Date
          </label>
          <input
            id="end-date-input"
            type="date"
            value={endDate}
            min={startDate}
            max={today}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
      </div>

      <div className="h-px bg-white/10" />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
            Forecast Horizon
          </label>
          <span className="text-sm font-bold text-blue-400 tabular-nums">
            {horizon}h ahead
          </span>
        </div>
        <Slider
          min={1}
          max={48}
          step={1}
          value={[horizon]}
          onValueChange={(val) => onHorizonChange(val[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/25">
          <span>1h</span>
          <span>24h</span>
          <span>48h</span>
        </div>
      </div>
    </div>
  );
}

export default function ControlPanel(props: ControlPanelProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block glass rounded-xl" style={{ padding: "1.25rem" }}>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
          Select Date Range &amp; Forecast Horizon
        </p>
        <PanelContent {...props} />
      </div>

      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        style={{
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? "auto" : "none",
        }}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-strong rounded-t-2xl transition-transform duration-300 ease-out"
        style={{
          transform: isDrawerOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="flex flex-col items-center pt-3 pb-2">
  <GripHorizontal className="h-5 w-5 text-white/20" />
</div>
        <div style={{ padding: "0 1.25rem 2rem 1.25rem" }}>
          <PanelContent {...props} />
        </div>
      </div>

      {!isDrawerOpen && (
  <button
    onClick={() => setIsDrawerOpen(true)}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-2 rounded-full glass-strong border border-blue-500/30 text-sm font-medium text-white shadow-lg transition-all-smooth hover:border-blue-500/60 active:scale-95"
    style={{ boxShadow: "0 0 20px rgba(59,130,246,0.2)", padding: "0.875rem 1.75rem" }}
  >
    <SlidersHorizontal className="h-4 w-4 text-blue-400" />
    Filter
  </button>
)}
    </>
  );
}