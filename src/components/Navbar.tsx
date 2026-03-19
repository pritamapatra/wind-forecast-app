import { Wind } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-3" style={{ padding: "0 2rem" }}>
          <div className="flex items-center gap-2.5">
            <Wind
              className="h-5 w-5 text-blue-400"
              strokeWidth={2}
            />
            <span
              className="text-base font-bold tracking-tight text-white"
              style={{
                textShadow: "0 0 20px rgba(59,130,246,0.5)",
              }}
            >
              GridLens
            </span>
          </div>
          <span className="text-xs text-white/40 tracking-widest uppercase hidden sm:block">
            Wind Forecast Monitor
          </span>
        </div>
      </div>
    </nav>
  );
}