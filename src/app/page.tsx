"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ControlPanel from "@/components/ControlPanel";
import ChartContainer from "@/components/ChartContainer";

export default function Home() {
  const [horizon, setHorizon] = useState<number>(4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-6">
          <ChartContainer />
          <ControlPanel
            horizon={horizon}
            onHorizonChange={setHorizon}
          />
        </div>
      </main>
    </div>
  );
}