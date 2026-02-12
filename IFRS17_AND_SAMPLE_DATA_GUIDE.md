# IFRS 17 and Sample Data for Reporting — Guide for Understanding

This guide explains **IFRS 17** (Insurance Contracts), how **sample data for reporting** (such as in your Excel file) supports it, and **what reports** can be generated from that data. It is written for understanding first; no software implementation is described.

---

## Part 1: Understanding IFRS 17

### What is IFRS 17?

**IFRS 17** is the International Financial Reporting Standard for **insurance contracts**. It replaced IFRS 4 and applies to annual reporting periods starting on or after 1 January 2023. Its main goals are:

- **Consistent measurement** of insurance contracts across insurers and countries  
- **Transparent disclosure** of amounts, assumptions, and risks  
- **Recognition of profit over the coverage period** rather than at inception  

If your company issues or holds insurance (or reinsurance) contracts and reports under IFRS, the numbers and disclosures in the financial statements must follow IFRS 17.

---

### Core ideas (in plain language)

**1. What is an “insurance contract”?**  
A contract under which one party (the insurer) accepts significant **insurance risk** from another party (the policyholder) by agreeing to pay if an uncertain future event (e.g. death, accident, disaster) adversely affects the policyholder. The standard also covers **reinsurance contracts** (where the insurer transfers part of that risk to another insurer).

**2. How are contracts measured?**  
At each reporting date, the insurer measures the contract (or group of contracts) using:

- **Fulfilment cash flows**  
  - Best estimate of future cash flows: premiums to receive, claims and benefits to pay, acquisition and other contract-related costs.  
  - Discounted to reflect the time value of money.  
  - Adjusted for risk (non-financial risk, e.g. uncertainty in claims) if not already in the cash flows.  

- **Contractual service margin (CSM)**  
  - For **profitable** contracts: the unearned profit, recognised in profit or loss over the period the insurer provides coverage (service period).  
  - For **loss-making (onerous)** contracts: no CSM; the loss is recognised immediately in profit or loss.  

So: **carrying amount ≈ fulfilment cash flows + CSM** (with some simplifications and specific rules for different models).

**3. Measurement models**  
IFRS 17 offers more than one way to measure, depending on the type of contract:

- **General measurement model (GMM)**  
  - Full build-up: estimated cash flows, discounting, risk adjustment, CSM.  
  - Used when no simplification applies.  

- **Premium allocation approach (PAA)**  
  - Simpler approach, mainly for **short-duration** contracts (e.g. one year or less).  
  - Liability is often measured as a proportion of premiums (unearned premium) and claims incurred, with less detailed discounting and CSM.  

- **Variable fee approach (VFA)**  
  - For contracts where the insurer’s fee is effectively a share of the underlying items (e.g. many unit-linked / participating contracts).  

Your **sample data** will typically feed into one or more of these models (e.g. PAA for short-term, GMM for long-term).

**4. Groups of contracts**  
Contracts are grouped into **portfolios** and then into **annual cohorts** (e.g. by year of inception). Measurement and CSM are applied at the **group** level, not only at individual contract level. So sample data is often structured by portfolio, product, and cohort so that these groupings can be applied.

**5. What appears in the financial statements?**  
- **Statement of financial position:**  
  - Assets: e.g. **reinsurance contract assets**, **insurance contract assets** (when the measurement is an asset).  
  - Liabilities: e.g. **insurance contract liabilities** (including CSM and loss components).  

- **Statement of profit or loss (and OCI):**  
  - Insurance revenue (from the release of CSM and other components).  
  - Insurance service expenses (e.g. claims, acquisition costs, changes in risk adjustment).  
  - Insurance finance income/expenses (e.g. discount unwind).  

So any “sample data for reporting” is ultimately used to compute these balances and movements.

---

### Why disclosure matters

IFRS 17 requires **extensive disclosures** so that users of the financial statements can understand:

- **What the recognised amounts represent** (e.g. reconciliation of the liability and CSM).  
- **What judgements and assumptions were used** (discount rates, mortality, lapse, expenses, etc.).  
- **What risks** the insurer is exposed to and how they affect the amounts.  

Your sample data (e.g. discount rates, assumptions, contract lists, premiums, claims) is the **input** to the numbers that are then disclosed and explained in the notes.

---

## Part 2: How sample data for reporting supports IFRS 17

A typical **“sample data for reporting”** Excel file (or similar) for IFRS 17 will contain data that supports **measurement**, **disclosure**, and **reconciliation**. You can think of it as the raw material for the standard’s requirements.

### Types of data commonly found (and how they relate to IFRS 17)

**1. Contract / policy data**  
- Contract ID, product, portfolio, inception date, coverage period.  
- **Use:** Identify portfolios and annual cohorts; determine which measurement model (GMM, PAA, VFA) applies; compute coverage period for CSM release.

**2. Premium data**  
- Premiums received or receivable (gross, net of reinsurance), timing, currency.  
- **Use:** Fulfilment cash flows (premiums in); PAA liability (unearned premium); revenue recognition.

**3. Claims / benefits data**  
- Incurred claims, paid claims, reserves, timing.  
- **Use:** Fulfilment cash flows (claims out); claims expense in the period; reconciliation of claims liability.

**4. Acquisition and other costs**  
- Commissions, underwriting costs, other directly attributable costs.  
- **Use:** Fulfilment cash flows; possible deferral and amortisation; insurance service expense.

**5. Discount rates and other assumptions**  
- Risk-free or other discount curves; mortality, lapse, expense assumptions.  
- **Use:** Discounting of cash flows; risk adjustment; CSM calculation; disclosure of “significant judgements”.

**6. Reinsurance data**  
- Ceded premiums, recoveries, reinsurance balances.  
- **Use:** Reinsurance contract assets/expense; presentation net vs gross; disclosure of reinsurance.

**7. Historical or run-off data**  
- Development of claims over time (triangles), historical lapse.  
- **Use:** Experience assumptions; risk adjustment; disclosure of nature and extent of risks.

**8. Balances and movements**  
- Opening/closing liability, CSM, risk adjustment; movements (e.g. CSM release, experience variance).  
- **Use:** Statement of financial position; reconciliation of liability and CSM; analysis of changes (required by IFRS 17).

Your **SAMPLLE DATA FOR REPORTING.xlsx** file likely contains one or more sheets with such data (e.g. one sheet per type of data, or one per product/portfolio). Understanding the **column headers and the meaning of each field** will tell you exactly how it maps to the concepts above.

---

### Linking the sample to the three disclosure areas

IFRS 17’s disclosure requirements are often summarised as:

| Area | Purpose | How sample data helps |
|------|--------|------------------------|
| **Explanation of recognised amounts** | Show what the numbers are and how they arose | Premiums, claims, discount rates, CSM, risk adjustment from your data feed the balances and the reconciliations (e.g. liability roll-forward, CSM roll-forward). |
| **Significant judgements** | Explain key assumptions and estimates | Assumption tables (rates, lapses, mortality, etc.) and discount curves in your data are the basis for describing judgements in the notes. |
| **Nature and extent of risks** | Describe insurance and financial risk | Contract counts, sums insured, term, product mix, and (if present) risk metrics or sensitivities derived from your data support risk disclosures. |

So: the same sample dataset is not only used to **calculate** the figures but also to **explain and justify** them in the report.

---

## Part 3: Reports that can be generated from the sample data

From data like that in **SAMPLLE DATA FOR REPORTING.xlsx**, the following **types of reports** can be produced to meet IFRS 17 and management needs. These are **report types and content**, not implementation steps.

---

### 1. **Statement of financial position (balance sheet) extracts**

- **Insurance contract liabilities** (by portfolio or product if required).  
- **Insurance contract assets** (where the measurement is an asset).  
- **Reinsurance contract assets**.  
- **Contractual service margin** (as a separate line or component).  

**Source in sample data:** Contract lists, premiums, claims, discount rates, assumptions, and any pre-calculated CSM or liability balances.

---

### 2. **Reconciliation of the insurance contract liability**

IFRS 17 requires a reconciliation showing how the **carrying amount** of groups of insurance contracts changed during the period. Typical columns:

- Opening balance  
- Add: New contracts / groups  
- Add/(less): Changes in estimates (cash flows, discount rate, risk adjustment)  
- Less: CSM release (recognised as revenue)  
- Less: Incurred claims and other expenses  
- Add: Premiums received (or similar, depending on presentation)  
- Other movements (e.g. currency, transfers)  
- Closing balance  

**Source in sample data:** Opening/closing balances, new business volumes and amounts, assumption changes, premiums, claims, and CSM release (if already calculated in the data or from the same inputs).

---

### 3. **Contractual service margin (CSM) reconciliation**

A separate reconciliation for the **CSM** (and, if applicable, **loss component**):

- Opening CSM  
- Add: CSM at initial recognition (new groups)  
- Add/(less): Changes in estimates that adjust CSM  
- Less: CSM released to profit or loss (insurance revenue)  
- Other (e.g. currency)  
- Closing CSM  

**Source in sample data:** New business data, assumption and discount rate data, coverage period, and any CSM or revenue templates that use the same inputs.

---

### 4. **Insurance revenue and insurance service expense**

- **Insurance revenue:** Often driven by release of CSM and other revenue components (e.g. premium allocation).  
- **Insurance service expense:** Claims incurred, acquisition costs, changes in risk adjustment, etc.  

**Source in sample data:** Premiums, claims, acquisition costs, risk adjustment movements, and CSM release (or the inputs to compute it).

---

### 5. **Insurance finance income or expense**

- Interest accretion (discount unwind) on the liability.  
- Effect of changes in discount rates (depending on accounting policy).  

**Source in sample data:** Discount curves, opening/closing liability and CSM, and timing of cash flows.

---

### 6. **Analysis of experience and assumption changes**

- **Experience variance:** Difference between actual (e.g. claims, lapses) and what was previously assumed.  
- **Assumption changes:** Effect of updating mortality, lapse, expense, or other assumptions.  
- **Discount rate changes:** Effect of updating the discount curve.  

**Source in sample data:** Assumption tables (current vs prior), actual claims and lapse data, discount curves (current vs prior).

---

### 7. **Maturity / duration analysis**

- Expected timing of cash flows (premiums, claims) by period (e.g. year 1–5, 5–10, 10+).  
- Supports **liquidity** and **risk** disclosures.  

**Source in sample data:** Contract terms, premium and claims cash flow projections (or run-off data).

---

### 8. **Concentration and risk reports**

- Exposure by product, geography, counterparty, or risk type.  
- Sums insured, contract counts, or other risk metrics.  

**Source in sample data:** Contract and policy attributes (product, region, etc.), sums insured, reinsurance counterparties.

---

### 9. **Sensitivity and scenario reports**

- Effect on liability or CSM of changes in key assumptions (e.g. discount rate ±1%, mortality ±10%).  
- Used for **disclosure of sensitivity** and “nature and extent of risks”.  

**Source in sample data:** Base liability and CSM (or the inputs to compute them), assumption tables and discount curves.

---

### 10. **Disclosure note drafts (quantitative tables)**

- Tables for the notes that show balances, reconciliations, and assumptions.  
- Many of these are **directly built** from the same reconciliations and analyses above (liability, CSM, revenue, expense, risk).  

**Source in sample data:** All of the above; the sample data is the single source for building the numbers that go into the notes.

---

### 11. **Management and internal reports**

- Premium and claims development; KPIs (e.g. loss ratio, CSM margin); portfolio and cohort summaries.  
- These may not be mandatory under IFRS 17 but are **generated from the same data** for steering the business and checking the IFRS 17 numbers.  

**Source in sample data:** Premiums, claims, contract counts, product/portfolio codes, and any calculated CSM or liability.

---

## Summary

- **IFRS 17** defines how to measure and disclose insurance (and reinsurance) contracts: fulfilment cash flows, CSM, grouping, and three measurement models (GMM, PAA, VFA).  
- **Sample data for reporting** (e.g. in **SAMPLLE DATA FOR REPORTING.xlsx**) typically holds contracts, premiums, claims, assumptions, discount rates, and possibly balances/movements. This data is the **input** for those measurements and disclosures.  
- From such data you can generate **financial statement line items**, **reconciliations (liability and CSM)**, **revenue and expense**, **finance income/expense**, **experience and assumption analyses**, **maturity and risk reports**, **sensitivity analyses**, **disclosure note tables**, and **management reports**.  

For your specific file, the next step is to **open the Excel file** and list the **sheet names and column headers**; then you can map each sheet/column to the concepts and report types above. If you share that structure (e.g. in a table or screenshot description), the same logic can be applied to say exactly which report each part of your sample supports.
