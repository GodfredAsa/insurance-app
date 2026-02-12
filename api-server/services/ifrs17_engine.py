"""
IFRS 17 calculation engine. Aggregations, reconciliations, and dashboard metrics.
"""
from typing import Any

from services.ifrs17_data import load_data


def _trend_pct(current: float, opening: float) -> float | None:
    """Return percentage change (current vs opening); None if opening is 0."""
    if opening == 0:
        return None
    return round((current - opening) / opening * 100, 1)


def get_metadata() -> dict[str, Any]:
    """Reporting metadata: date, currency, portfolios."""
    data = load_data()
    meta = data.get("metadata", {})
    return {
        "reporting_date": meta.get("reporting_date"),
        "currency": meta.get("currency"),
        "portfolios": meta.get("portfolios", []),
        "description": meta.get("description"),
    }


def _build_by_portfolio(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Build by-portfolio aggregates: count, premium, claims, liability, csm, opening."""
    contracts = data.get("contracts", [])
    premiums = data.get("premiums", [])
    claims = data.get("claims", [])
    lm = data.get("liability_movements", [])
    cm = data.get("csm_movements", [])
    contract_by_id = {c["contract_id"]: c for c in contracts}
    ports = list({c["portfolio"] for c in contracts}) or data.get("metadata", {}).get("portfolios", [])
    by_portfolio: dict[str, dict[str, Any]] = {
        p: {"premium": 0, "claims": 0, "liability": 0, "csm": 0, "count": 0, "opening": 0}
        for p in ports
    }
    for c in contracts:
        p = c["portfolio"]
        if p not in by_portfolio:
            by_portfolio[p] = {"premium": 0, "claims": 0, "liability": 0, "csm": 0, "count": 0, "opening": 0}
        by_portfolio[p]["count"] += 1
    for r in premiums:
        c = contract_by_id.get(r["contract_id"])
        if c and c["portfolio"] in by_portfolio:
            by_portfolio[c["portfolio"]]["premium"] += r.get("gross_premium", 0)
    for r in claims:
        c = contract_by_id.get(r["contract_id"])
        if c and c["portfolio"] in by_portfolio:
            by_portfolio[c["portfolio"]]["claims"] += r.get("incurred_amount", 0)
    for r in lm:
        if r["portfolio"] in by_portfolio:
            by_portfolio[r["portfolio"]]["liability"] += r.get("closing_balance", 0)
            by_portfolio[r["portfolio"]]["opening"] += r.get("opening_balance", 0)
    for r in cm:
        if r["portfolio"] in by_portfolio:
            by_portfolio[r["portfolio"]]["csm"] += r.get("closing_csm", 0)
    return by_portfolio


def get_dashboard_summary() -> dict[str, Any]:
    """Totals and trend percentages for dashboard cards."""
    data = load_data()
    lm = data.get("liability_movements", [])
    cm = data.get("csm_movements", [])
    prem = data.get("premiums", [])
    cl = data.get("claims", [])
    ac = data.get("acquisition_costs", [])
    rein = data.get("reinsurance", [])

    total_liability_close = sum(r.get("closing_balance", 0) for r in lm)
    total_liability_open = sum(r.get("opening_balance", 0) for r in lm)
    total_csm_close = sum(r.get("closing_csm", 0) for r in cm)
    total_csm_open = sum(r.get("opening_csm", 0) for r in cm)
    total_csm_release = sum(r.get("csm_release_to_pl", 0) or 0 for r in cm)
    total_gross = sum(r.get("gross_premium", 0) for r in prem)
    total_net = sum(r.get("net_premium", 0) for r in prem)
    total_incurred = sum(r.get("incurred_amount", 0) for r in cl)
    total_paid = sum(r.get("paid_amount", 0) or 0 for r in cl)
    total_outstanding = sum(r.get("outstanding_reserve", 0) or 0 for r in cl)
    total_acq = sum(r.get("total", 0) for r in ac)
    total_rein_asset = sum(r.get("reinsurance_asset_balance", 0) for r in rein)
    contracts_count = len(data.get("contracts", []))

    loss_ratio_pct = round(total_incurred / total_net * 100, 1) if total_net else None
    liability_trend = _trend_pct(total_liability_close, total_liability_open)
    csm_trend = _trend_pct(total_csm_close, total_csm_open)

    by_portfolio = _build_by_portfolio(data)
    # Portfolio order from metadata
    ports = data.get("metadata", {}).get("portfolios", list(by_portfolio.keys()))

    return {
        "insurance_liability": total_liability_close,
        "insurance_liability_opening": total_liability_open,
        "liability_trend_pct": liability_trend,
        "reinsurance_asset": total_rein_asset,
        "closing_csm": total_csm_close,
        "csm_trend_pct": csm_trend,
        "gross_premium": total_gross,
        "net_premium": total_net,
        "claims_incurred": total_incurred,
        "loss_ratio_pct": loss_ratio_pct,
        "contracts_count": contracts_count,
        "insurance_revenue_csm_release": total_csm_release,
        "acquisition_costs_total": total_acq,
        "claims_paid": total_paid,
        "claims_outstanding_reserve": total_outstanding,
        "by_portfolio": {
            p: by_portfolio.get(p, {"premium": 0, "claims": 0, "liability": 0, "csm": 0, "count": 0, "opening": 0})
            for p in ports
        },
        "portfolios": ports,
    }


def get_dashboard_liability_trend() -> dict[str, Any]:
    """Liability by cohort year for line chart. Labels and values."""
    data = load_data()
    lm = data.get("liability_movements", [])
    cohort_years = sorted({r["cohort_year"] for r in lm})
    values = [
        sum(r["closing_balance"] for r in lm if r["cohort_year"] == y)
        for y in cohort_years
    ]
    return {"labels": [str(y) for y in cohort_years], "values": values}


def get_dashboard_csm_trend() -> dict[str, Any]:
    """CSM by cohort year for line chart."""
    data = load_data()
    cm = data.get("csm_movements", [])
    cohort_years = sorted({r["cohort_year"] for r in cm})
    values = [
        sum(r["closing_csm"] for r in cm if r["cohort_year"] == y)
        for y in cohort_years
    ]
    return {"labels": [str(y) for y in cohort_years], "values": values}


def get_dashboard_portfolio_comparison() -> list[dict[str, Any]]:
    """Table rows: portfolio, contracts, gross premium, claims, loss %, closing liability, closing CSM."""
    summary = get_dashboard_summary()
    rows = []
    for p in summary["portfolios"]:
        bp = summary["by_portfolio"].get(p, {})
        premium = bp.get("premium", 0) or 0
        claims = bp.get("claims", 0) or 0
        loss_pct = round(claims / premium * 100, 1) if premium else None
        rows.append({
            "portfolio": p,
            "contracts": bp.get("count", 0),
            "gross_premium": premium,
            "claims": claims,
            "loss_ratio_pct": loss_pct,
            "closing_liability": bp.get("liability", 0),
            "closing_csm": bp.get("csm", 0),
        })
    return rows


def get_reconciliation_liability() -> dict[str, Any]:
    """Liability reconciliation: rows by portfolio/cohort plus totals."""
    data = load_data()
    lm = data.get("liability_movements", [])
    rows = [
        {
            "portfolio": r["portfolio"],
            "cohort_year": r["cohort_year"],
            "opening_balance": r.get("opening_balance", 0),
            "new_contracts": r.get("new_contracts", 0),
            "premiums_received": r.get("premiums_received", 0),
            "claims_incurred": r.get("claims_incurred", 0),
            "csm_release": r.get("csm_release", 0),
            "experience_variance": r.get("experience_variance", 0),
            "closing_balance": r.get("closing_balance", 0),
        }
        for r in lm
    ]
    totals = {
        "opening_balance": sum(r["opening_balance"] for r in rows),
        "new_contracts": sum(r["new_contracts"] for r in rows),
        "premiums_received": sum(r["premiums_received"] for r in rows),
        "claims_incurred": sum(r["claims_incurred"] for r in rows),
        "csm_release": sum(r["csm_release"] for r in rows),
        "experience_variance": sum(r["experience_variance"] for r in rows),
        "closing_balance": sum(r["closing_balance"] for r in rows),
    }
    return {"rows": rows, "totals": totals}


def get_reconciliation_csm() -> dict[str, Any]:
    """CSM reconciliation: rows by portfolio/cohort plus totals."""
    data = load_data()
    cm = data.get("csm_movements", [])
    rows = [
        {
            "portfolio": r["portfolio"],
            "cohort_year": r["cohort_year"],
            "opening_csm": r.get("opening_csm", 0),
            "initial_recognition": r.get("initial_recognition", 0),
            "changes_in_estimates": r.get("changes_in_estimates", 0),
            "csm_release_to_pl": r.get("csm_release_to_pl", 0),
            "closing_csm": r.get("closing_csm", 0),
        }
        for r in cm
    ]
    total_release = sum(r["csm_release_to_pl"] for r in rows)
    totals = {
        "opening_csm": sum(r["opening_csm"] for r in rows),
        "initial_recognition": sum(r["initial_recognition"] for r in rows),
        "changes_in_estimates": sum(r["changes_in_estimates"] for r in rows),
        "csm_release_to_pl": total_release,
        "closing_csm": sum(r["closing_csm"] for r in rows),
    }
    return {"rows": rows, "totals": totals, "insurance_revenue_from_csm_release": total_release}


def get_data(
    portfolio: str | None = None,
    cohort_year: int | None = None,
) -> dict[str, Any]:
    """Raw IFRS 17 data, optionally filtered by portfolio or cohort."""
    data = load_data()
    if not portfolio and cohort_year is None:
        return data
    contracts = data.get("contracts", [])
    if portfolio:
        contract_ids = {c["contract_id"] for c in contracts if c["portfolio"] == portfolio}
    else:
        contract_ids = {c["contract_id"] for c in contracts}
    if cohort_year is not None:
        contract_ids &= {c["contract_id"] for c in contracts if c.get("cohort_year") == cohort_year}
    out = {"metadata": data.get("metadata"), "contracts": [c for c in contracts if c["contract_id"] in contract_ids]}
    for key in ("premiums", "claims", "acquisition_costs", "reinsurance"):
        out[key] = [r for r in data.get(key, []) if r.get("contract_id") in contract_ids]
    for key in ("assumptions", "discount_rates", "liability_movements", "csm_movements", "claims_development"):
        items = data.get(key, [])
        if key == "liability_movements" or key == "csm_movements":
            items = [r for r in items if (portfolio is None or r.get("portfolio") == portfolio) and (cohort_year is None or r.get("cohort_year") == cohort_year)]
        elif key == "claims_development" and cohort_year is not None:
            items = [r for r in items if r.get("cohort_year") == cohort_year]
        elif key == "assumptions" and portfolio:
            items = [r for r in items if r.get("portfolio") == portfolio]
        out[key] = items
    return out
