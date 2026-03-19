import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-6">
      <div className="mx-auto max-w-7xl" style={{ padding: "1.5rem 1.25rem" }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-white/25">
          <span>Powered by</span>
          <a
            href="https://www.elexon.co.uk/data-and-reporting/balancing-mechanism-reporting-service/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/40 hover:text-blue-400 transition-colors duration-200"
          >
            Elexon BMRS API
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="hidden sm:inline text-white/15 ">·</span>
          <span>Data restricted to GB national wind generation</span>
        </div>
      </div>
    </footer>
  );
}