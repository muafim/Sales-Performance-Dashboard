# Sales Performance Dashboard

## Overview

A responsive, client-side beverage sales dashboard adapted from a one-page Power BI report. It preserves the report's original Price, Quantity, and Revenue calculations, then adds clearer target comparisons and business insights. The public site uses **synthetic demonstration data** because the supplied workbook prohibits redistribution.

## Dashboard Preview

Add a screenshot here after publishing the site. The dashboard includes KPI cards, month and brand filters, a revenue trend, product ranking, U.S. state map, targets, and dynamically calculated insights.

## Business Questions

- How does revenue change throughout the year?
- Which beverage brands generate the most revenue?
- Which states contribute the most sales?
- How does selected-period performance compare with monthly targets?

## Dataset

The source workbook contains 3,739 transaction rows in `Data`, a `Dates` sheet, a `Monthly Targets` sheet, and a copyright notice on `Cover Page`. Its transaction fields are retailer, retailer ID, date, month, region, state, beverage brand, unit price, and units sold. Six brands and 48 states appear in the supplied workbook. The PBIX has one 1,280×720 report page with a header, three cards, revenue column chart, brand slicer, revenue map, and month slicer.

The checked-in `src/data/demoSalesData.json` is generated independently by `scripts/generate-demo.mjs`. It uses the same schema and intended functionality, but its rows and analytical results are invented. To regenerate it, run `npm run generate:demo`.

For private local analysis, place the licensed workbook in the project root and run:

```bash
npm run prepare:data
npm run dev
```

Then open `http://localhost:5173/?data=local`. The preprocessing script validates fields, derives month from the date, computes revenue, and writes `local-data/salesData.json`. This directory is Git-ignored and served **only by Vite's local development server**; it is never copied into a production build. Without `?data=local`, the app shows synthetic data. If local data is unavailable, the app falls back to synthetic data with a notice.

## Data Model

Each `SalesRecord` has `retailer`, `retailerId`, `date`, `month`, `monthName`, `region`, `state`, `beverageBrand`, `pricePerUnit`, `unitsSold`, and `revenue`. The source `Month` formula is independently normalized from the transaction date. Aggregation and filtering utilities are in `src/utils/analytics.ts`.

## Key Metrics

| Metric | Formula | Interpretation |
| --- | --- | --- |
| Revenue | `SUM(pricePerUnit × unitsSold)` | Sales value |
| Units Sold | `SUM(unitsSold)` | Total quantity |
| Price (Power BI) | `SUM(pricePerUnit)` | Original report card logic; **not** an average |
| Average Selling Price | `Revenue / Units Sold` | Revenue-weighted unit price |

The monthly targets from the workbook are $1,000,000 revenue, 1,500,000 units, and $0.65 average price. Revenue and quantity target denominators are multiplied by the number of selected months. With no month filter, the dashboard compares the full year to 12 monthly targets. Average price always compares to $0.65 because it is a rate, not an additive total.

## Features

- Accessible multi-select brand and chronological month filters with reset controls.
- Shared filtered data across KPIs, target bars, both charts, map, and insight cards.
- Monthly revenue tooltips with revenue, units, and average selling price.
- Bundled, offline U.S. TopoJSON map with state revenue, units, and share of total.
- Responsive cards and charts, keyboard-friendly controls, and empty states.
- No backend, database, authentication, API keys, or runtime map service.

## Tech Stack

Vite, React, TypeScript, Tailwind CSS, Recharts, React Simple Maps, `us-atlas`, Lucide React. `read-excel-file` is a development dependency used only by the local preprocessing script.

## Project Structure

```text
.github/workflows/deploy.yml    GitHub Pages workflow
scripts/generate-demo.mjs       Synthetic demo generator
scripts/prepare-data.mjs        Private workbook preprocessing
src/components/dashboard/      Dashboard presentation components
src/data/demoSalesData.json     Synthetic public data
src/hooks/                     Shared filter state
src/types/                     TypeScript sales model
src/utils/                     Aggregations and formatting
```

## Running Locally

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
npm run preview
```

The build uses the synthetic dataset. The local licensed dataset remains outside the Vite production input and `dist/`. Vite's `base` reads `GITHUB_REPOSITORY` in GitHub Actions, so repository renames update asset paths automatically. For a custom-domain/root deployment, set `base: '/'` in `vite.config.ts`.

## Deploying to GitHub Pages

1. Push the project to a GitHub repository with `main` as the default branch. Confirm the original `.xlsx`, `.pbix`, and `local-data/` files are not tracked.
2. Open **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source.
3. Push to `main` or run **Deploy to GitHub Pages** from the Actions tab. The workflow runs `npm ci`, builds, and publishes `dist/`.

## Data Licensing

The original Kenji Explains / Career Principles workbook states that it may not be reproduced or distributed without permission. The workbook and PBIX remain local and are excluded by `.gitignore`; the public dataset is synthetic and labeled as such in the UI. Do not publish screenshots or rows from the licensed source without permission.

## Insights

The app calculates the top brand, top state, best month, and average selling price from whichever dataset and filters are active. No fixed sales conclusions are claimed in this README because the public data is synthetic and filterable.
