# IFRS 17 Sample Data — File Guide

Sample data for IFRS 17 reporting is provided in two formats.

---

## 1. JSON format (single file)

**File:** `ifrs17_sample_data.json`

Contains all tables in one file with keys:

- `metadata` — Reporting date, currency, portfolios
- `contracts` — Contract/policy data (portfolio, product, cohort, measurement model)
- `premiums` — Gross, ceded, net premiums by contract and period
- `claims` — Incurred/paid amounts and outstanding reserves
- `acquisition_costs` — Commission and underwriting costs
- `assumptions` — Lapse, inflation, mortality by portfolio
- `discount_rates` — Yield curve by term
- `reinsurance` — Ceded premium, recoveries, reinsurance asset
- `liability_movements` — Liability reconciliation by portfolio and cohort
- `csm_movements` — CSM reconciliation by portfolio and cohort
- `claims_development` — Claims development triangle

Use this for system integration, APIs, or programmatic reporting.

---

## 2. Excel-friendly format (CSV files)

Each table is in a separate CSV file that can be opened in Excel. To build one workbook with multiple sheets: open Excel, create a new workbook, then use **Data > Get Data / From Text/CSV** (or **From File**) to import each CSV as a new sheet and name the sheet after the file.

| CSV file | Content |
|----------|--------|
| `IFRS17_sample_data_contracts.csv` | Contracts |
| `IFRS17_sample_data_premiums.csv` | Premiums |
| `IFRS17_sample_data_claims.csv` | Claims |
| `IFRS17_sample_data_acquisition_costs.csv` | Acquisition costs |
| `IFRS17_sample_data_assumptions.csv` | Assumptions |
| `IFRS17_sample_data_discount_rates.csv` | Discount rates |
| `IFRS17_sample_data_reinsurance.csv` | Reinsurance |
| `IFRS17_sample_data_liability_movements.csv` | Liability reconciliation inputs |
| `IFRS17_sample_data_csm_movements.csv` | CSM reconciliation inputs |
| `IFRS17_sample_data_claims_development.csv` | Claims development triangle |

---

## 3. Related documents

- **IFRS17_AND_SAMPLE_DATA_GUIDE.md** — Explains IFRS 17 and how this data supports measurement and disclosure.
- **IFRS17_SAMPLE_DATA_ANALYSIS.md** — Lists the analyses and reports that can be produced from this data.

Data is illustrative (e.g. reporting date 2024-12-31, USD, three portfolios: Motor, Property, Life). Replace with actual data for production reporting.
