# IFRS 17 System Build Plan — For an Insurance Company

This document suggests a **practical plan** to build a system that supports IFRS 17 reporting for an insurance company. It ties together what you already have (sample data, report UI, Angular client, API server) and adds a clear path to a full, production-style solution.

---

## 1. Why a System (Not Just Spreadsheets)?

| Need | Why a system helps |
|------|---------------------|
| **Compliance** | IFRS 17 has strict rules on measurement (GMM, PAA, VFA), grouping (portfolio, cohort), and disclosure. A system can enforce these rules and audit trails. |
| **Volume** | Real portfolios have thousands of contracts; Excel and manual work do not scale. |
| **Reconciliations** | Liability and CSM reconciliations must tie to source data. A system can trace every number back to contracts, premiums, and assumptions. |
| **Disclosures** | Many quantitative tables (reconciliations, assumptions, sensitivities) are required. A system can generate them from one source of truth. |
| **Consistency** | Same discount rates, assumptions, and logic applied everywhere; fewer manual errors and version mismatches. |

So the goal is: **one place for data → consistent calculations → reports and disclosures**.

---

## 2. High-Level Architecture (Understanding First)

Think of the system in four layers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PRESENTATION (what users see)                                           │
│  Dashboards, reconciliations, disclosure tables, charts, export (PDF/Excel) │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│  APPLICATION (API + business logic)                                      │
│  REST API, authentication, “get liability reconciliation”, “get CSM”    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│  CALCULATION / ENGINE (IFRS 17 rules)                                    │
│  Liability roll-forward, CSM roll-forward, revenue, discounting, PAA/GMM│
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│  DATA (source of truth)                                                  │
│  Contracts, premiums, claims, assumptions, discount rates, reinsurance    │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data** = your source data (like `ifrs17_sample_data.json` today, later a database).
- **Calculation / Engine** = code that applies IFRS 17 (grouping, discounting, CSM release, reconciliations).
- **Application** = API that exposes “get dashboard”, “get liability reconciliation”, etc., and calls the engine.
- **Presentation** = the UI (e.g. your current `index.html` or the Angular app) and any exports.

You build **from the bottom up**: get data and calculations right first, then expose them via API, then build or refine the UI.

---

## 3. Phased Plan (What to Build and in What Order)

### Phase 1: Data foundation and single source of truth

**Goal:** Define and store all IFRS 17 source data in one place so the rest of the system can rely on it.

| Step | What to do | Why / explanation |
|------|------------|-------------------|
| 1.1 | **Define a data model** (tables/entities) that matches your sample: contracts, premiums, claims, acquisition_costs, assumptions, discount_rates, reinsurance, liability_movements, csm_movements, claims_development. | So every report and calculation uses the same structure; no ambiguity. |
| 1.2 | **Choose storage:** start with **file-based** (e.g. JSON/CSV) for speed; later move to a **database** (e.g. PostgreSQL) when volume or multi-user needs grow. | File-based matches your current `ifrs17_sample_data.json`; DB when you need history, concurrency, and scale. |
| 1.3 | **Add metadata:** reporting date, currency, list of portfolios. | Needed for every report (as in your current `metadata`). |
| 1.4 | **Optional:** Simple **validation** (e.g. contract_id in premiums exists in contracts; dates in range). | Catches bad data early. |

**Outcome:** A clear, documented data model and a single place (file or DB) that holds “the” IFRS 17 input data.

**What you already have:** `ifrs17_sample_data.json` and the CSV set are a good starting data model; the guide in `IFRS17_AND_SAMPLE_DATA_GUIDE.md` and `IFRS17_SAMPLE_DATA_README.md` document it.

---

### Phase 2: Calculation engine (IFRS 17 logic)

**Goal:** Implement the calculations that turn raw data into IFRS 17 outputs: liability reconciliation, CSM reconciliation, revenue/expense, and any derived KPIs.

| Step | What to do | Why / explanation |
|------|------------|-------------------|
| 2.1 | **Aggregations by portfolio and cohort:** From contracts, premiums, claims, etc., compute totals and movements by portfolio and cohort year. | IFRS 17 reports and disclosures are by group (portfolio/cohort); this is the core grouping. |
| 2.2 | **Liability reconciliation:** Implement the roll-forward: opening + new contracts + premiums − claims − CSM release + experience/other = closing. Use `liability_movements` (or compute from underlying data). | This is a mandatory IFRS 17 disclosure; the engine should produce it from one source. |
| 2.3 | **CSM reconciliation:** Opening CSM + initial recognition + changes in estimates − CSM release = closing CSM. Use `csm_movements` or equivalent. | Required disclosure; also drives insurance revenue. |
| 2.4 | **Derived metrics:** Loss ratio, gross/net premium, reinsurance asset, CSM and liability by cohort for charts. | These feed the dashboard and management reports (as in your `index.html`). |
| 2.5 | **Optional (later):** Discounting, risk adjustment, full GMM/PAA formulas if you need to *compute* liability/CSM from first principles. | For a first version, using pre-calculated movements (as in your sample) is enough; add full models when actuaries need them. |

**Outcome:** A set of functions or services that, given the data layer, return reconciliation tables, KPIs, and series for charts. No UI yet—pure logic.

**What you already have:** The logic in `index.html` (aggregation by portfolio, liability/CSM by cohort, loss ratio, etc.) is a prototype of this engine; the next step is to move that logic into the API server (e.g. Python) so it can serve any client.

---

### Phase 3: API layer (expose data and calculations)

**Goal:** A REST API that the front-end (and later other tools) can call to get metadata, reconciliations, chart data, and disclosure tables.

| Step | What to do | Why / explanation |
|------|------------|-------------------|
| 3.1 | **Load and serve raw data (or subsets):** e.g. `GET /api/ifrs17/data` or `GET /api/ifrs17/contracts`, with optional filters (portfolio, cohort). | Front-end and engine both use the same source; no duplicate data entry. |
| 3.2 | **Endpoints for dashboard:** e.g. `GET /api/ifrs17/dashboard/summary` (totals for cards), `GET /api/ifrs17/dashboard/premium-by-portfolio`, `GET /api/ifrs17/dashboard/liability-trend`. | The current `index.html` builds these in the browser; moving them to the API makes the UI thin and reusable (e.g. Angular, Excel export). |
| 3.3 | **Endpoints for reconciliations:** e.g. `GET /api/ifrs17/reconciliations/liability`, `GET /api/ifrs17/reconciliations/csm`. | Direct support for disclosure production and audit. |
| 3.4 | **Metadata and parameters:** e.g. `GET /api/ifrs17/metadata` (reporting date, currency, portfolios). | So the UI can show the right labels and currency (e.g. GHS). |
| 3.5 | **Authentication and authorisation (optional for first release):** Protect endpoints so only authorised users (e.g. finance, actuaries) can access. | Your `api-server` already has `auth/`; you can plug in later. |

**Outcome:** A documented API that returns everything the report and dashboard need. The front-end only renders; it does not recalculate.

**What you already have:** FastAPI in `api-server/`; you can add an `ifrs17` router and services that read from `ifrs17_sample_data.json` (or DB) and call the engine from Phase 2.

---

### Phase 4: Presentation (reports and dashboards)

**Goal:** Users see dashboards, reconciliations, and disclosure-style tables; optionally export to Excel/PDF.

| Step | What to do | Why / explanation |
|------|------------|-------------------|
| 4.1 | **Reuse or replace the static report:** Your current `index.html` is a full IFRS 17 report (dashboard + 12 sections). Either keep it as a **standalone** view that reads from the API, or rebuild the same layout in the **Angular** app. | One report that always uses API data ensures consistency and avoids maintaining two logics. |
| 4.2 | **Dashboard:** Summary cards (liability, CSM, premium, claims, loss ratio, etc.), bar/line/doughnut charts. Data from API (e.g. `/dashboard/summary`, `/dashboard/...`). | Same as today’s dashboard, but fed by API so it stays in sync with the engine. |
| 4.3 | **Reconciliation pages/tables:** Dedicated views for liability and CSM reconciliations (and optionally revenue/expense), with tables that match disclosure format. | Supports both internal review and drafting of note tables. |
| 4.4 | **Sections 1–12 (disclosure areas):** Liability reconciliation, CSM, revenue & expense, development, experience, reinsurance, concentration, discount rates, assumptions, balances, new business, claims reserves. Each section can be a page or a block that gets data from the API. | Aligns the UI with the structure in `IFRS17_AND_SAMPLE_DATA_GUIDE.md` and your current `index.html`. |
| 4.5 | **Export:** Allow “Export to Excel” or “Export to PDF” for selected tables or full report. | Needed for audit, regulatory filing, and management packs. |

**Outcome:** A single place (Angular app or static page driven by API) where finance and actuaries view and export IFRS 17 outputs.

**What you already have:** `index.html` is a complete prototype; the Angular app in `client/` has a dashboard structure (see `DASHBOARD_BUILD_PLAN.md`). You can either (a) make `index.html` call the API and keep it as the report, or (b) rebuild the report inside Angular with your existing shared components (cards, charts).

---

### Phase 5: Control, governance, and scale (later)

**Goal:** Improve robustness, auditability, and scalability once the core is in place.

| Step | What to do | Why / explanation |
|------|------------|-------------------|
| 5.1 | **Versioning and reporting periods:** Store data by reporting date (e.g. 2024-12-31, 2024-09-30); allow comparison across periods. | Needed for quarterly and annual reporting and variance analysis. |
| 5.2 | **User roles and permissions:** Restrict who can change assumptions, discount rates, or upload data; who can only view. | Reduces risk of unauthorised changes to numbers used in financial statements. |
| 5.3 | **Audit log:** Log who changed what (e.g. assumption set, discount curve) and when. | Supports internal audit and regulator questions. |
| 5.4 | **Full measurement models:** If required, implement full PAA/GMM (and optionally VFA) from cash flows and assumptions, not only pre-aggregated movements. | Needed when you stop feeding pre-calculated liability/CSM and instead compute them in the system. |
| 5.5 | **Sensitivity and scenario runs:** E.g. “liability if discount rate +1%”; “CSM if lapse +10%”. | Supports risk disclosures and management. |

---

## 4. How the Pieces Fit (Summary)

| Layer | Purpose | You have today | Next step |
|-------|---------|-----------------|-----------|
| **Data** | Single source: contracts, premiums, claims, assumptions, rates, movements | `ifrs17_sample_data.json`, CSVs | Add API that reads this (and later DB + validation). |
| **Engine** | Liability/CSM reconciliations, KPIs, chart series | Logic embedded in `index.html` | Move that logic into the API server (e.g. Python); expose via endpoints. |
| **API** | Serve data and computed results to the UI | FastAPI app in `api-server/` | Add IFRS 17 routes and services that call the engine. |
| **Presentation** | Dashboards, tables, exports | `index.html` (full report); Angular shell | Either drive `index.html` from API or rebuild report in Angular; add export. |

---

## 5. Suggested Order of Implementation (Concrete)

1. **Data:** Keep using `ifrs17_sample_data.json`; document the schema (you have this in the README and guide). Optionally add a small Python module that loads and validates it.
2. **Engine in API:** In `api-server/`, add a service (e.g. `ifrs17_engine.py` or `services/ifrs17/`) that:
   - Loads the JSON (or later, reads from DB),
   - Replicates the aggregations and reconciliations you already have in `index.html`,
   - Returns dicts/lists ready for JSON (summary, by portfolio, liability trend, CSM trend, reconciliation rows).
3. **API routes:** Add e.g. `GET /api/ifrs17/metadata`, `GET /api/ifrs17/dashboard/summary`, `GET /api/ifrs17/dashboard/portfolio-comparison`, `GET /api/ifrs17/reconciliations/liability`, `GET /api/ifrs17/reconciliations/csm`. Each route calls the engine and returns JSON.
4. **Front-end:** Change `index.html` to **fetch** from these endpoints instead of using embedded JSON and client-side aggregation; or build an Angular “IFRS 17 report” module that consumes the same endpoints and renders the same sections.
5. **Export:** Add an endpoint or client-side action that exports key tables to Excel (e.g. using openpyxl or a front-end library) or PDF.

This order gives you a working end-to-end flow (data → engine → API → report) with minimal change to the current report layout, and a clear path to add database, auth, and full measurement models later.

---

## 6. Documents and Code to Use

- **Understanding IFRS 17 and data:** `IFRS17_AND_SAMPLE_DATA_GUIDE.md`
- **What analyses/reports exist:** `IFRS17_SAMPLE_DATA_ANALYSIS.md`
- **Sample data layout:** `IFRS17_SAMPLE_DATA_README.md`, `ifrs17_sample_data.json`, `IFRS17_sample_data_*.csv`
- **Report prototype:** `index.html` (dashboard + 12 sections; reference for API response shape and UI)
- **API and client:** `api-server/`, `client/` (Angular); extend these rather than building from scratch.

Using this plan, you can build a system that truly “caters for” IFRS 17: one source of data, consistent calculations, and a clear path from data to disclosure-ready reports and dashboards.
