# GridLens — UK Wind Power Forecast Monitor

A full-stack web application that visualises UK national wind power generation
against WINDFOR forecasts from the Elexon BMRS API in real time.
Built as a software engineering challenge submission.

**Live URL:** https://wind-forecast-app-five.vercel.app

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Project Structure](#project-structure)
- [Backend Logic](#backend-logic)
- [Data Science Analysis](#data-science-analysis)
- [AI Tools Declaration](#ai-tools-declaration)

---

## Overview

GridLens fetches two data streams from the Elexon BMRS API:

- **FUELHH** — actual half-hourly wind generation (MW) for fuel type `WIND`
- **WINDFOR** — published wind power forecasts at varying horizons (0–48 hours)

The app joins these streams on `startTime`, filters by a user-selected forecast
horizon, and renders an interactive area chart comparing actual vs forecast MW
output. A data science notebook (`analysis/analysis.ipynb`) performs a
statistical error analysis and derives a business recommendation for grid
planning.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, custom glassmorphism CSS |
| Charts | Recharts (AreaChart, ResponsiveContainer) |
| UI Components | shadcn/ui |
| Date Utilities | date-fns |
| Backend | Next.js API Routes (server-side, Node.js) |
| Data Source | Elexon BMRS REST API (public, no auth) |
| Deployment | Vercel |
| Data Science | Python, Pandas, NumPy, Matplotlib, Seaborn (Google Colab) |

---

## Local Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/pritampatra/wind-forecast-app.git
cd wind-forecast-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No environment variables are required. The Elexon BMRS API is fully public
and requires no API key.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure
wind-forecast-app/
├── analysis/
│ └── analysis.ipynb # Phase 4: Jupyter notebook, error analysis
│ # and business recommendation
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── wind-data/
│ │ │ └── route.ts # API route: fetches + joins FUELHH & WINDFOR
│ │ ├── globals.css # Dark theme, glassmorphism utilities, grid overlay
│ │ ├── layout.tsx # Root layout, Inter font, metadata
│ │ └── page.tsx # Root page, state management, debounced fetching
│ └── components/
│ ├── ChartContainer.tsx # Recharts AreaChart, gradients, custom tooltip
│ ├── ControlPanel.tsx # Date range pickers, horizon slider, mobile drawer
│ ├── Footer.tsx # Attribution footer
│ ├── MetricCards.tsx # Avg actual, avg forecast, mean error, peak actual
│ └── Navbar.tsx # Sticky glassmorphism nav, GridLens branding
├── .vercel/ # Vercel project config (auto-generated)
├── .git/ # Full git history across all 4 phases
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md

---

## Backend Logic

The single API route at `/api/wind-data` (`src/app/api/wind-data/route.ts`)
performs the following pipeline on every request:

1. **Fetch actuals** — queries `FUELHH` stream with `settlementDateFrom`,
   `settlementDateTo`, and `fuelType=WIND`
2. **Fetch forecasts** — queries `WINDFOR` stream with `publishDateTimeFrom`
   set to 48 hours before the start date to capture all relevant forecast batches
3. **Resolution alignment** — FUELHH returns 30-minute intervals; WINDFOR is
   hourly. Actuals are filtered to `:00` timestamps only (one actual per hour)
   to enable a clean join
4. **Horizon filtering** — for each forecast row, `horizonHours = (startTime -
   publishTime) / 3600`. Only forecasts where `horizonHours` is closest to the
   user-selected horizon value are kept, one forecast per `startTime`
5. **Join** — actuals and filtered forecasts are joined on `startTime` and
   returned as a flat JSON array to the frontend

---

## Data Science Analysis

`analysis/analysis.ipynb` covers two tasks:

**Task A — Forecast Error Characterisation**

- Raw error defined as `error = actual - forecast` (MW)
- Global statistics: mean signed error **-1,366 MW**, p99 absolute error
  **5,486 MW**
- Key finding: **80.9% of forecasts over-predict** wind generation — a
  structural directional bias in WINDFOR, not random noise
- Error grows monotonically with horizon: MAE increases **45%** from
  1,360 MW (0–8h) to 1,978 MW (40–48h)
- Diurnal pattern: errors peak overnight (00:00–06:00 UTC, MAE ~1,900 MW)
  and trough at midday (12:00–14:00 UTC, MAE ~1,380 MW)

**Task B — Reliable Generation Baseline**

- Historical actual generation (Jan–Feb 2025) shows a coefficient of variation
  of 46.6% — wind is highly volatile
- Reliable floor defined as the **p5 percentile** of hourly actuals: **2,387 MW**
- Business recommendation: grid operators should commit to no more than
  2,387 MW of wind as a firm baseload-equivalent floor (95% historical
  confidence), and procure backup dispatchable capacity for the remaining
  demand

---

## AI Tools Declaration

This project was built with the assistance of AI tools in accordance with the
challenge guidelines, which permit AI use for low-level implementation help
while requiring original analytical reasoning.

| Phase | AI Tool Used | Scope of Use |
|---|---|---|
| Phase 1 — Scaffolding | Perplexity AI | Next.js project setup, Tailwind config, shadcn/ui installation commands |
| Phase 2 — Backend | Perplexity AI | API route structure, TypeScript interface definitions, Elexon API query parameter syntax |
| Phase 3 — Frontend | Perplexity AI | React component code (Navbar, ChartContainer, ControlPanel, MetricCards, Footer), Recharts AreaChart with gradient fills, glassmorphism CSS, mobile bottom drawer implementation |
| Phase 4 — Analysis | Perplexity AI | Low-level Pandas/Matplotlib syntax help (groupby, percentile calls, plot formatting). All analytical reasoning, hypothesis formation, trade-off decisions, and business recommendation are original. |

The analytical thinking in the Jupyter notebook — including the choice of
error metric, the horizon binning strategy, the diurnal hypothesis and its
refutation, and the p5 percentile recommendation — was derived from
first-principles reasoning and is entirely the author's own work.