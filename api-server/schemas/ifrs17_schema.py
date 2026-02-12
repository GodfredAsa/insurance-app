# IFRS 17 API response schemas (for documentation and optional validation)

from pydantic import BaseModel


class MetadataResponse(BaseModel):
    """Reporting metadata."""

    reporting_date: str | None
    currency: str | None
    portfolios: list[str]
    description: str | None = None


class LiabilityReconciliationRow(BaseModel):
    """Single row of liability reconciliation."""

    portfolio: str
    cohort_year: int
    opening_balance: float
    new_contracts: float
    premiums_received: float
    claims_incurred: float
    csm_release: float
    experience_variance: float
    closing_balance: float


class CSMReconciliationRow(BaseModel):
    """Single row of CSM reconciliation."""

    portfolio: str
    cohort_year: int
    opening_csm: float
    initial_recognition: float
    changes_in_estimates: float
    csm_release_to_pl: float
    closing_csm: float
