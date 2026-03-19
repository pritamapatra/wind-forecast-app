"use client";

import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ControlPanelProps {
  horizon: number;
  onHorizonChange: (value: number) => void;
}

export default function ControlPanel({
  horizon,
  onHorizonChange,
}: ControlPanelProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Controls</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Forecast Horizon
            </span>
            <span className="text-sm font-semibold text-foreground">
              {horizon}h
            </span>
          </div>
          <Slider
            min={0}
            max={48}
            step={1}
            value={[horizon]}
            onValueChange={(val) => onHorizonChange(val[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0h</span>
            <span>24h</span>
            <span>48h</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-blue-500 rounded" />
            <span className="text-muted-foreground">Actual generation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-8 h-0.5 bg-green-500 rounded" />
            <span className="text-muted-foreground">Forecast</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}