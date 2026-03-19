export default function Header() {
  return (
    <header className="w-full border-b border-border bg-background px-6 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            UK Wind Power Forecast Monitor
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Actual vs forecasted national wind generation
          </p>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:block">
          Source: Elexon BMRS API
        </span>
      </div>
    </header>
  );
}