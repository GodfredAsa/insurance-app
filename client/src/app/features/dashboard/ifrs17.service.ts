import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE = `${environment.apiUrl}/api/v1/ifrs17`;

export interface Ifrs17Metadata {
  reporting_date: string | null;
  currency: string | null;
  portfolios: string[];
  description?: string | null;
}

export interface Ifrs17DashboardSummary {
  insurance_liability: number;
  insurance_liability_opening?: number;
  liability_trend_pct?: number | null;
  reinsurance_asset: number;
  closing_csm: number;
  csm_trend_pct?: number | null;
  gross_premium: number;
  net_premium: number;
  claims_incurred: number;
  loss_ratio_pct?: number | null;
  contracts_count: number;
  insurance_revenue_csm_release?: number;
  acquisition_costs_total?: number;
  claims_paid?: number;
  claims_outstanding_reserve?: number;
  by_portfolio: Record<string, { premium: number; claims: number; liability: number; csm: number; count: number; opening: number }>;
  portfolios: string[];
}

export interface Ifrs17Trend {
  labels: string[];
  values: number[];
}

export interface Ifrs17PortfolioComparisonRow {
  portfolio: string;
  contracts: number;
  gross_premium: number;
  claims: number;
  loss_ratio_pct: number | null;
  closing_liability: number;
  closing_csm: number;
}

export interface Ifrs17Dashboard {
  summary: Ifrs17DashboardSummary;
  liability_trend: Ifrs17Trend;
  csm_trend: Ifrs17Trend;
  portfolio_comparison: Ifrs17PortfolioComparisonRow[];
}

export interface Ifrs17LiabilityRow {
  portfolio: string;
  cohort_year: number;
  opening_balance: number;
  new_contracts: number;
  premiums_received: number;
  claims_incurred: number;
  csm_release: number;
  experience_variance: number;
  closing_balance: number;
}

export interface Ifrs17LiabilityReconciliation {
  rows: Ifrs17LiabilityRow[];
  totals: Record<string, number>;
}

export interface Ifrs17CsmRow {
  portfolio: string;
  cohort_year: number;
  opening_csm: number;
  initial_recognition: number;
  changes_in_estimates: number;
  csm_release_to_pl: number;
  closing_csm: number;
}

export interface Ifrs17CsmReconciliation {
  rows: Ifrs17CsmRow[];
  totals: Record<string, number>;
  insurance_revenue_from_csm_release?: number;
}

export interface Ifrs17Data {
  metadata?: Ifrs17Metadata;
  contracts?: unknown[];
  premiums?: unknown[];
  claims?: unknown[];
  acquisition_costs?: unknown[];
  assumptions?: unknown[];
  discount_rates?: unknown[];
  reinsurance?: unknown[];
  liability_movements?: unknown[];
  csm_movements?: unknown[];
  claims_development?: unknown[];
}

@Injectable({ providedIn: 'root' })
export class Ifrs17Service {
  constructor(private http: HttpClient) {}

  getMetadata(): Observable<Ifrs17Metadata | null> {
    return this.http.get<Ifrs17Metadata>(`${BASE}/metadata`).pipe(
      catchError(() => of(null))
    );
  }

  getDashboard(): Observable<Ifrs17Dashboard | null> {
    return this.http.get<Ifrs17Dashboard>(`${BASE}/dashboard`).pipe(
      catchError(() => of(null))
    );
  }

  getReconciliationLiability(): Observable<Ifrs17LiabilityReconciliation | null> {
    return this.http.get<Ifrs17LiabilityReconciliation>(`${BASE}/reconciliations/liability`).pipe(
      catchError(() => of(null))
    );
  }

  getReconciliationCsm(): Observable<Ifrs17CsmReconciliation | null> {
    return this.http.get<Ifrs17CsmReconciliation>(`${BASE}/reconciliations/csm`).pipe(
      catchError(() => of(null))
    );
  }

  getData(portfolio?: string, cohort_year?: number): Observable<Ifrs17Data | null> {
    let url = `${BASE}/data`;
    const params: string[] = [];
    if (portfolio) params.push(`portfolio=${encodeURIComponent(portfolio)}`);
    if (cohort_year != null) params.push(`cohort_year=${cohort_year}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<Ifrs17Data>(url).pipe(
      catchError(() => of(null))
    );
  }
}
