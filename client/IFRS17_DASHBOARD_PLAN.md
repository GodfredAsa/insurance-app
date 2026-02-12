# Plan: Replace Client Dashboard with IFRS 17 Report (from index.html)

## Goal

- Replace the current Angular dashboard content with the **IFRS 17 report** from the project root **index.html**.
- **Keep unchanged:** sidebar, app component layout, header, other feature modules (wallet, transaction, crypto, exchange, settings), and shared components (card, sidebar, nav-item, donut-chart, bar-chart, line-chart).
- **Data source:** Consume the **api-server** IFRS 17 API (dashboard, reconciliations, data). Ensure the **api-server allows the Angular origin** (CORS) so the client can call it.

---

## 1. API server – CORS

- **What:** Add FastAPI `CORSMiddleware` in **api-server/main.py**.
- **Allow origin:** Angular dev server (e.g. `http://localhost:4200`). Optionally allow a production origin later.
- **Allow methods/headers:** Typical for SPA (GET, POST, etc.; Authorization, Content-Type).
- **No other server changes.**

---

## 2. Client – API base URL and HTTP

- **What:** Define API base URL so the client can call the api-server.
  - Add **environment** (e.g. `src/environments/environment.ts`) with `apiUrl: 'http://localhost:8000'` for development, or a single **constant** in a shared place.
- **What:** Ensure **HttpClient** is available: add `provideHttpClient()` in **app.config.ts** (if not already there).

---

## 3. Client – IFRS 17 API service

- **What:** New **Ifrs17Service** (e.g. under `features/dashboard/` or `core/services/`).
- **Endpoints to call:**
  - `GET /api/v1/ifrs17/metadata` → reporting date, currency, portfolios.
  - `GET /api/v1/ifrs17/dashboard` → combined: summary, liability trend, CSM trend, portfolio comparison (one call for the dashboard section).
  - `GET /api/v1/ifrs17/reconciliations/liability` → liability reconciliation rows + totals.
  - `GET /api/v1/ifrs17/reconciliations/csm` → CSM reconciliation rows + totals + insurance revenue from CSM release.
  - `GET /api/v1/ifrs17/data` (no params) → full raw data for sections 4–12 (development, experience, reinsurance, concentration, discount, assumptions, balances, new business, claims reserves).
- **Responsibility:** Map responses to simple interfaces (or use `any`); handle errors and return observables.

---

## 4. Client – Replace dashboard component content

- **What:** Replace the current **DashboardComponent** template and class so that the **main content** (inside the existing app layout and sidebar) is the IFRS 17 report, matching **index.html** structure.
- **Layout (single scrollable page):**
  - **Report header:** Title “IFRS 17 — Sample Data Analysis” (or similar), reporting date, currency, portfolios (from metadata).
  - **Sticky in-page nav:** Same links as index.html: “Summary & charts”, “1. Liability reconciliation”, “2. CSM reconciliation”, … “12. Claims reserves” (anchor links to section ids).
  - **Section: Dashboard (summary & charts):**
    - Summary cards: Insurance liability (with trend), Reinsurance asset, Closing CSM (with trend), Gross premium, Net premium, Claims incurred, Loss ratio, Contracts (from dashboard summary).
    - Charts (using existing shared components where applicable):
      - **Donut:** Gross premium by portfolio.
      - **Donut:** Closing liability by portfolio.
      - **Bar (grouped):** Premium vs claims by portfolio (two series: gross premium, claims incurred).
      - **Bar (grouped):** Opening vs closing liability (two series).
      - **Line:** Liability trend by cohort year (labels + values from dashboard liability_trend).
      - **Line:** CSM trend by cohort year (labels + values from dashboard csm_trend).
    - **Table:** Portfolio comparison (portfolio, contracts, gross premium, claims, loss %, closing liability, closing CSM) from dashboard portfolio_comparison.
  - **Sections 1–12:** Same titles and content as index.html:
    1. Liability reconciliation → table from `/reconciliations/liability`.
    2. CSM reconciliation → table from `/reconciliations/csm` + summary box (insurance revenue from CSM release).
    3. Revenue & expense → summary boxes (revenue, claims, acquisition) + acquisition costs table from full data or summary.
    4. Premium and claims development → premiums table + claims development triangle from data.
    5. Experience and assumptions → table from data (experience variance + changes in estimates).
    6. Reinsurance → summary (ceded, recoveries, reinsurance asset) + table from data.
    7. Concentration & mix → contract count by portfolio + premium by portfolio from data.
    8. Discount rates → table from data.
    9. Assumptions → table from data.
    10. Balances → total liability, reinsurance asset + table by portfolio/cohort from data.
    11. New business → contracts table + summary from data.
    12. Claims reserves → summary (incurred, paid, outstanding) + claims table from data.
- **Data flow:** On init, component (or a parent) calls Ifrs17Service: metadata, dashboard, liability reconciliation, CSM reconciliation, data. Store in component state; template binds to that state. Show loading/error states.
- **Styling:** Reuse Tailwind where possible; add component-level or global styles for tables, summary boxes, and section layout to mirror index.html (cards, borders, spacing). Currency display from metadata (e.g. GHS or API currency).

---

## 5. What is not changed

- **Sidebar:** Same component, same nav items (Overview, Orders, etc.) – only the **content** of the dashboard route changes.
- **App component:** Same shell (sidebar + main + header + router-outlet).
- **Other features:** Wallet, Transaction, Crypto, Exchange, Settings – no changes.
- **Shared components:** Card, DonutChart, BarChart, LineChart, Sidebar, NavItem – used as-is; only the **dashboard** uses them with IFRS 17 data.

---

## 6. Implementation order

1. **api-server:** Add CORS middleware (allow Angular origin).
2. **client:** Add API base URL (environment or constant) and `provideHttpClient()` in app.config.
3. **client:** Create Ifrs17Service and call the five endpoints above.
4. **client:** Replace DashboardComponent: fetch on init, then render report header, sticky nav, dashboard section (cards + charts + table), and sections 1–12 with tables/summary boxes from API data.

---

## 7. Files to create or modify

| Location | Action |
|----------|--------|
| **api-server/main.py** | Add CORSMiddleware (allow_origins including http://localhost:4200). |
| **client/src/app/app.config.ts** | Add provideHttpClient() if missing. |
| **client/src/environments/environment.ts** | Create with apiUrl for dev (or use constant in service). |
| **client/src/app/features/dashboard/ifrs17.service.ts** | Create: HTTP calls to /api/v1/ifrs17/*. |
| **client/src/app/features/dashboard/dashboard.component.ts** | Replace template and class: IFRS 17 report layout, sections, charts, tables; use Ifrs17Service. |
| **client/src/styles.css** or dashboard styles | Add styles for IFRS 17 tables, summary boxes, section spacing (to match index.html). |

No new routes: dashboard route stays `/dashboard` and loads the same DashboardComponent (with new content).
