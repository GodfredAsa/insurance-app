# IFRS 17 API — dashboard, reconciliations, and data. No auth required (per plan).

from fastapi import APIRouter, HTTPException, Query

from services import ifrs17_engine

router = APIRouter()


@router.get("/metadata")
def get_metadata():
    """Reporting date, currency, portfolios."""
    try:
        return ifrs17_engine.get_metadata()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/dashboard/summary")
def get_dashboard_summary():
    """Dashboard summary: totals, trend %, by_portfolio, portfolios list."""
    try:
        return ifrs17_engine.get_dashboard_summary()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/dashboard/liability-trend")
def get_dashboard_liability_trend():
    """Liability by cohort year (labels and values for line chart)."""
    try:
        return ifrs17_engine.get_dashboard_liability_trend()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/dashboard/csm-trend")
def get_dashboard_csm_trend():
    """CSM by cohort year (labels and values for line chart)."""
    try:
        return ifrs17_engine.get_dashboard_csm_trend()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/dashboard/portfolio-comparison")
def get_dashboard_portfolio_comparison():
    """Portfolio comparison table: portfolio, contracts, premium, claims, loss %, liability, CSM."""
    try:
        return ifrs17_engine.get_dashboard_portfolio_comparison()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/dashboard")
def get_dashboard():
    """Single call: summary + liability trend + csm trend + portfolio comparison."""
    try:
        summary = ifrs17_engine.get_dashboard_summary()
        liability_trend = ifrs17_engine.get_dashboard_liability_trend()
        csm_trend = ifrs17_engine.get_dashboard_csm_trend()
        portfolio_comparison = ifrs17_engine.get_dashboard_portfolio_comparison()
        return {
            "summary": summary,
            "liability_trend": liability_trend,
            "csm_trend": csm_trend,
            "portfolio_comparison": portfolio_comparison,
        }
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/reconciliations/liability")
def get_reconciliation_liability():
    """Liability reconciliation: rows by portfolio/cohort and totals."""
    try:
        return ifrs17_engine.get_reconciliation_liability()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/reconciliations/csm")
def get_reconciliation_csm():
    """CSM reconciliation: rows by portfolio/cohort, totals, and insurance revenue from CSM release."""
    try:
        return ifrs17_engine.get_reconciliation_csm()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e


@router.get("/data")
def get_data(
    portfolio: str | None = Query(None, description="Filter by portfolio"),
    cohort_year: int | None = Query(None, description="Filter by cohort year"),
):
    """Raw IFRS 17 data. Optional query params: portfolio, cohort_year."""
    try:
        return ifrs17_engine.get_data(portfolio=portfolio, cohort_year=cohort_year)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
