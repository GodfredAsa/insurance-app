# Analysis That Can Be Drawn from the IFRS 17 Sample Data

This document describes the **analyses and reports** that can be produced from the sample data in **ifrs17_sample_data.json** and the **IFRS17_sample_data_*.csv** files (or **IFRS17_sample_data.xlsx** if generated), in line with the guide in **IFRS17_AND_SAMPLE_DATA_GUIDE.md**.

---

## 1. Source Data Summary

The sample data includes:

| Data set | Purpose |
|----------|--------|
| **Contracts** | Portfolio, product, cohort, measurement model (PAA/GMM), coverage period |
| **Premiums** | Gross, ceded, net premiums by contract and period |
| **Claims** | Incurred and paid amounts, outstanding reserves |
| **Acquisition costs** | Commission and underwriting costs by contract |
| **Assumptions** | Lapse, claim inflation, mortality by portfolio |
| **Discount rates** | Yield curve by term as at reporting date |
| **Reinsurance** | Ceded premiums, recoveries, reinsurance asset balance |
| **Liability movements** | Opening/closing balance and movements by portfolio and cohort |
| **CSM movements** | Opening/closing CSM, initial recognition, changes in estimates, release to P&L |
| **Claims development** | Development of claims by cohort (triangle) |

---

## 2. Analyses That Can Be Drawn

### 2.1 Insurance contract liability reconciliation

**What it is:** Reconciliation of the carrying amount of insurance contract liabilities from opening to closing balance, by portfolio and/or cohort, as required by IFRS 17.

**Data used:**  
- **Liability movements** (opening_balance, new_contracts, premiums_received, claims_incurred, csm_release, experience_variance, closing_balance).  
- Optionally **contracts** and **premiums** to cross-check new business and premium flows.

**Analysis:**  
- For each portfolio and cohort_year, show: Opening + New contracts + Premiums received + Claims incurred + CSM release + Experience variance = Closing.  
- Subtotal by portfolio, then grand total.  
- Identifies which cohorts and portfolios drive the change in the liability.

---

### 2.2 Contractual service margin (CSM) reconciliation

**What it is:** Reconciliation of the CSM from opening to closing, showing initial recognition, changes in estimates, and release to profit or loss.

**Data used:**  
- **CSM movements** (opening_csm, initial_recognition, changes_in_estimates, csm_release_to_pl, closing_csm).

**Analysis:**  
- By portfolio and cohort: Opening CSM + Initial recognition + Changes in estimates − CSM release to P&L = Closing CSM.  
- Sum of **csm_release_to_pl** = total insurance revenue from CSM release in the period.  
- Distinguish profitable cohorts (positive CSM) from run-off (CSM trending to zero).

---

### 2.3 Insurance revenue and insurance service expense

**What it is:** Amounts recognised in profit or loss for insurance revenue and insurance service expenses.

**Data used:**  
- **CSM movements** (csm_release_to_pl → revenue).  
- **Claims** (incurred_amount, paid_amount, outstanding_reserve → claims expense).  
- **Acquisition costs** (total → acquisition expense or amortisation).  
- **Premiums** (net_premium by period for revenue timing under PAA if applicable).

**Analysis:**  
- **Insurance revenue:** e.g. CSM release + (for PAA) earned premium component.  
- **Insurance service expense:** Incurred claims + acquisition costs (or amortisation) + change in risk adjustment if present.  
- Can be broken down by portfolio and by type (claims vs acquisition).

---

### 2.4 Premium and claims development (run-off)

**What it is:** How premiums and claims emerge over time by cohort; supports loss ratio and reserve adequacy.

**Data used:**  
- **Premiums** (gross_premium, net_premium by contract and period).  
- **Claims** (incurred_amount, paid_amount, outstanding_reserve).  
- **Claims development** (development_year_1, 2, 3, incremental_claims by cohort_year).

**Analysis:**  
- **Premium development:** Total premium by cohort year and by period; gross vs ceded vs net.  
- **Claims development triangle:** Cumulative or incremental claims by cohort and development year; identify late-reported claims and tail.  
- **Loss ratio:** Incurred claims / earned premium by cohort or portfolio (using premiums and claims data).

---

### 2.5 Experience variance and assumption change analysis

**What it is:** Splitting the change in liability and CSM into (a) experience (actual vs previous assumptions) and (b) assumption changes (updated assumptions).

**Data used:**  
- **Liability movements** (experience_variance).  
- **CSM movements** (changes_in_estimates).  
- **Claims** and **premiums** for actual experience; **assumptions** for prior vs current.

**Analysis:**  
- **Experience variance:** e.g. from liability_movements; explain which portfolios/cohorts had favourable or adverse experience.  
- **Assumption changes:** From changes_in_estimates in CSM; explain impact of updating lapse, mortality, discount rate, etc.  
- Supports disclosure of “significant judgements” and sensitivity.

---

### 2.6 Reinsurance and net exposure

**What it is:** How much risk is ceded, how much has been recovered, and the reinsurance contract asset.

**Data used:**  
- **Reinsurance** (ceded_premium_ytd, recoveries_ytd, reinsurance_asset_balance).  
- **Premiums** (ceded_premium).  
- **Claims** (incurred/paid) with reinsurance recoveries.

**Analysis:**  
- Total ceded premium vs gross premium (cession ratio).  
- Recoveries vs incurred claims (recovery ratio).  
- Total reinsurance asset by reinsurer and by portfolio.  
- Net retention by portfolio (gross claims − recoveries).

---

### 2.7 Concentration and mix analysis

**What it is:** Where the book is concentrated (portfolio, product, cohort, reinsurer) for risk and disclosure.

**Data used:**  
- **Contracts** (portfolio, product, cohort_year).  
- **Premiums** (gross_premium, net_premium).  
- **Liability movements** or **CSM movements** (closing_balance, closing_csm).  
- **Reinsurance** (reinsurer).

**Analysis:**  
- Contract count and premium by portfolio and product.  
- Liability and CSM by portfolio and cohort.  
- Ceded premium and reinsurance asset by reinsurer.  
- Identifies largest portfolios, products, and reinsurance counterparties.

---

### 2.8 Discount rate and sensitivity

**What it is:** Impact of discount rates on the liability and CSM; basis for insurance finance expense and sensitivity disclosure.

**Data used:**  
- **Discount rates** (term_years, rate_pct).  
- **Liability movements** and **CSM movements** (to relate balances to duration).

**Analysis:**  
- **Discount curve:** Plot rate_pct vs term_years for the reporting date.  
- **Sensitivity:** If you have duration or model output, show effect of ±1% (or ±50bp) discount rate on liability and CSM.  
- **Insurance finance expense:** Unwind of discount (approximated from opening balance × discount rate and duration).

---

### 2.9 Assumptions summary for disclosure

**What it is:** Table of significant assumptions used in measurement, for the “significant judgements” disclosure.

**Data used:**  
- **Assumptions** (portfolio, assumption_type, value_pct, effective_date, description).

**Analysis:**  
- One row per portfolio and assumption type (lapse, claim inflation, mortality).  
- Show effective date and brief description.  
- Can be extended with “prior year” column to show assumption changes.

---

### 2.10 Statement of financial position extracts

**What it is:** Insurance contract liabilities and reinsurance contract assets at the reporting date.

**Data used:**  
- **Liability movements** (closing_balance by portfolio/cohort).  
- **Reinsurance** (reinsurance_asset_balance).  
- **CSM movements** (closing_csm) if you need to split liability into components.

**Analysis:**  
- **Insurance contract liabilities:** Sum of closing_balance across portfolios/cohorts.  
- **Reinsurance contract assets:** Sum of reinsurance_asset_balance (e.g. by reinsurer or contract).  
- Optional: Split liability into “fulfilment cash flows” and “CSM” if your data structure supports it.

---

### 2.11 New business and cohort growth

**What it is:** Volume and value of new contracts and how the book is growing by cohort.

**Data used:**  
- **Contracts** (inception_date, cohort_year, portfolio, product).  
- **Premiums** (gross_premium, net_premium for new business).  
- **Liability movements** (new_contracts).  
- **CSM movements** (initial_recognition).

**Analysis:**  
- New contract count by cohort year and portfolio.  
- New business premium and initial CSM by cohort.  
- Year-on-year growth in new business and in total liability/CSM.

---

### 2.12 Claims reserve and payment pattern

**What it is:** Outstanding claims reserves and how quickly claims are paid.

**Data used:**  
- **Claims** (incurred_amount, paid_amount, outstanding_reserve, incurred_date, paid_date).

**Analysis:**  
- Total outstanding reserve by portfolio or contract.  
- Paid vs outstanding by cohort or incurral period.  
- Average time from incurral to payment (if paid_date is populated).  
- Supports “nature and extent of risks” and liquidity disclosure.

---

## 3. Summary Table: Data → Analysis

| Analysis | Main data sources | Output / report type |
|----------|-------------------|----------------------|
| Liability reconciliation | Liability movements, Contracts, Premiums | Reconciliation table; disclosure note |
| CSM reconciliation | CSM movements | Reconciliation table; disclosure note |
| Insurance revenue & expense | CSM movements, Claims, Acquisition costs, Premiums | P&L breakdown; disclosure note |
| Premium & claims development | Premiums, Claims, Claims development | Triangles; loss ratio; run-off |
| Experience & assumption changes | Liability movements, CSM movements, Assumptions | Variance report; disclosure note |
| Reinsurance & net exposure | Reinsurance, Premiums, Claims | Cession ratio; reinsurance asset; net retention |
| Concentration & mix | Contracts, Premiums, Liability/CSM movements, Reinsurance | Mix tables; risk disclosure |
| Discount rate & sensitivity | Discount rates, Liability/CSM balances | Curve; sensitivity table; finance expense |
| Assumptions summary | Assumptions | Disclosure table (significant judgements) |
| Statement of financial position | Liability movements, Reinsurance, CSM movements | Balance sheet extracts |
| New business & cohort growth | Contracts, Premiums, Liability/CSM movements | New business report; growth metrics |
| Claims reserve & payment pattern | Claims | Reserve summary; payment pattern |

---

## 4. File Reference

- **ifrs17_sample_data.json** — Single JSON file containing all sample tables (contracts, premiums, claims, acquisition_costs, assumptions, discount_rates, reinsurance, liability_movements, csm_movements, claims_development).
- **IFRS17_sample_data_*.csv** — Same data in CSV form; each file can be opened in Excel. Import each CSV as a separate sheet into one workbook to replicate a multi-sheet Excel file.
- **IFRS17_AND_SAMPLE_DATA_GUIDE.md** — Conceptual guide to IFRS 17 and how sample data supports measurement and reporting.
- **IFRS17_SAMPLE_DATA_ANALYSIS.md** — This document: analyses that can be drawn from the sample data.

Using the same structure with real data, the same types of analyses support the IFRS 17 financial statements and notes.
