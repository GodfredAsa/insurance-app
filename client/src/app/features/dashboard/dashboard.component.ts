import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../../shared/components/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../shared/components/line-chart/line-chart.component';
import { BarSeries, DonutChartItem, LineSeries } from '../../shared/models/chart.model';
import { IFRS17_STATIC_DATA } from './ifrs17-static-data';

const CHART_COLORS: Record<string, string> = {
  Motor: 'rgba(66, 133, 244, 0.8)',
  Property: 'rgba(52, 168, 83, 0.8)',
  Life: 'rgba(251, 188, 5, 0.8)',
};

function fmtNum(n: number | null | undefined): string {
  if (n == null) return '—';
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function fmtPct(n: number | null | undefined): string {
  if (n == null) return '—';
  return Number(n) + '%';
}

interface ByPortfolio {
  premium: number;
  claims: number;
  liability: number;
  csm: number;
  count: number;
  opening: number;
}

interface PortfolioComparisonRow {
  portfolio: string;
  contracts: number;
  gross_premium: number;
  claims: number;
  loss_ratio_pct: string;
  closing_liability: number;
  closing_csm: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, BarChartComponent, DonutChartComponent, LineChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  /** Which section to show (one page per section). From route data. */
  readonly currentSection = signal<string>('summary');

  readonly data = IFRS17_STATIC_DATA;

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.currentSection.set((d['section'] as string) ?? 'summary');
    });
  }
  readonly currency = this.data.metadata.currency;
  readonly reportingDate = this.data.metadata.reporting_date;
  readonly portfolios = [...this.data.metadata.portfolios];

  readonly lm = this.data.liability_movements;
  readonly cm = this.data.csm_movements;
  readonly prem = this.data.premiums;
  readonly cl = this.data.claims;
  readonly ac = this.data.acquisition_costs;
  readonly rein = this.data.reinsurance;
  readonly contracts = this.data.contracts;
  readonly assump = this.data.assumptions;
  readonly disc = this.data.discount_rates;
  readonly dev = this.data.claims_development;

  /** Totals (same logic as index.html) */
  readonly totalLiabilityClose = this.lm.reduce((s, r) => s + r.closing_balance, 0);
  readonly totalLiabilityOpen = this.lm.reduce((s, r) => s + r.opening_balance, 0);
  readonly totalCSMClose = this.cm.reduce((s, r) => s + r.closing_csm, 0);
  readonly totalCSMOpen = this.cm.reduce((s, r) => s + r.opening_csm, 0);
  readonly totalCSMRelease = this.cm.reduce((s, r) => s + (r.csm_release_to_pl ?? 0), 0);
  readonly totalGross = this.prem.reduce((s, r) => s + r.gross_premium, 0);
  readonly totalNet = this.prem.reduce((s, r) => s + r.net_premium, 0);
  readonly totalIncurred = this.cl.reduce((s, r) => s + r.incurred_amount, 0);
  readonly totalPaid = this.cl.reduce((s, r) => s + (r.paid_amount ?? 0), 0);
  readonly totalOutstanding = this.cl.reduce((s, r) => s + (r.outstanding_reserve ?? 0), 0);
  readonly totalAcq = this.ac.reduce((s, r) => s + r.total, 0);
  readonly totalReinAsset = this.rein.reduce((s, r) => s + r.reinsurance_asset_balance, 0);
  readonly totalCededYtd = this.rein.reduce((s, r) => s + r.ceded_premium_ytd, 0);
  readonly totalRecoveries = this.rein.reduce((s, r) => s + r.recoveries_ytd, 0);
  readonly contractsCount = this.contracts.length;

  readonly lossRatioPct = this.totalNet ? ((this.totalIncurred / this.totalNet) * 100).toFixed(1) : '—';
  readonly liabilityTrendPct = this.totalLiabilityOpen ? ((this.totalLiabilityClose - this.totalLiabilityOpen) / this.totalLiabilityOpen) * 100 : null;
  readonly csmTrendPct = this.totalCSMOpen ? ((this.totalCSMClose - this.totalCSMOpen) / this.totalCSMOpen) * 100 : null;

  /** byPortfolio: Motor, Property, Life with premium, claims, liability, csm, count, opening */
  readonly byPortfolio: Record<string, ByPortfolio> = (() => {
    const ports = this.portfolios;
    const out: Record<string, ByPortfolio> = {};
    ports.forEach((p) => { out[p] = { premium: 0, claims: 0, liability: 0, csm: 0, count: 0, opening: 0 }; });
    this.contracts.forEach((c) => { out[c.portfolio].count++; });
    const contractById = new Map(this.contracts.map((c) => [c.contract_id, c]));
    this.prem.forEach((r) => {
      const c = contractById.get(r.contract_id);
      if (c && out[c.portfolio]) out[c.portfolio].premium += r.gross_premium;
    });
    this.cl.forEach((r) => {
      const c = contractById.get(r.contract_id);
      if (c && out[c.portfolio]) out[c.portfolio].claims += r.incurred_amount;
    });
    this.lm.forEach((r) => {
      if (out[r.portfolio]) { out[r.portfolio].liability += r.closing_balance; out[r.portfolio].opening += r.opening_balance; }
    });
    this.cm.forEach((r) => {
      if (out[r.portfolio]) out[r.portfolio].csm += r.closing_csm;
    });
    return out;
  })();

  /** Liability by cohort year [2022, 2023, 2024] */
  readonly liabilityByCohort = [2022, 2023, 2024].map((y) => this.lm.filter((r) => r.cohort_year === y).reduce((s, r) => s + r.closing_balance, 0));
  /** CSM by cohort year */
  readonly csmByCohort = [2022, 2023, 2024].map((y) => this.cm.filter((r) => r.cohort_year === y).reduce((s, r) => s + r.closing_csm, 0));
  readonly cohortLabels = ['2022', '2023', '2024'];

  /** Portfolio comparison table rows */
  readonly portfolioComparison: PortfolioComparisonRow[] = this.portfolios.map((port) => {
    const x = this.byPortfolio[port];
    const lossPct = x.premium ? ((x.claims / x.premium) * 100).toFixed(1) : '—';
    return {
      portfolio: port,
      contracts: x.count,
      gross_premium: x.premium,
      claims: x.claims,
      loss_ratio_pct: lossPct + '%',
      closing_liability: x.liability,
      closing_csm: x.csm,
    };
  });

  /** Chart data */
  donutPremiumData: DonutChartItem[] = this.portfolios.map((p) => ({
    label: p,
    value: this.byPortfolio[p].premium,
    color: CHART_COLORS[p] ?? '#94a3b8',
  }));
  donutLiabilityData: DonutChartItem[] = this.portfolios.map((p) => ({
    label: p,
    value: this.byPortfolio[p].liability,
    color: CHART_COLORS[p] ?? '#94a3b8',
  }));
  barPremiumClaimsSeries: BarSeries[] = [
    { name: 'Gross premium', data: this.portfolios.map((p) => this.byPortfolio[p].premium), color: 'rgba(66, 133, 244, 0.7)' },
    { name: 'Claims incurred', data: this.portfolios.map((p) => this.byPortfolio[p].claims), color: 'rgba(234, 67, 53, 0.7)' },
  ];
  barOpeningClosingSeries: BarSeries[] = [
    { name: 'Opening liability', data: this.portfolios.map((p) => this.byPortfolio[p].opening), color: 'rgba(158, 158, 158, 0.7)' },
    { name: 'Closing liability', data: this.portfolios.map((p) => this.byPortfolio[p].liability), color: 'rgba(52, 168, 83, 0.7)' },
  ];
  lineLiabilitySeries: LineSeries[] = [{ name: 'Closing liability', data: this.liabilityByCohort, color: 'rgb(66, 133, 244)' }];
  lineCsmSeries: LineSeries[] = [{ name: 'Closing CSM', data: this.csmByCohort, color: 'rgb(52, 168, 83)' }];

  readonly fmtNum = fmtNum;
  readonly fmtPct = fmtPct;

  trendText(pct: number | null): string {
    if (pct == null) return '';
    const up = pct >= 0;
    return (up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(1) + '% vs opening';
  }

  /** CSM reconciliation totals row */
  readonly csmTotals = {
    opening_csm: IFRS17_STATIC_DATA.csm_movements.reduce((s, r) => s + r.opening_csm, 0),
    initial_recognition: IFRS17_STATIC_DATA.csm_movements.reduce((s, r) => s + r.initial_recognition, 0),
    changes_in_estimates: IFRS17_STATIC_DATA.csm_movements.reduce((s, r) => s + r.changes_in_estimates, 0),
  };

  /** Liability reconciliation totals row */
  readonly liabilityTotals = {
    new_contracts: IFRS17_STATIC_DATA.liability_movements.reduce((s, r) => s + r.new_contracts, 0),
    premiums_received: IFRS17_STATIC_DATA.liability_movements.reduce((s, r) => s + r.premiums_received, 0),
    claims_incurred: IFRS17_STATIC_DATA.liability_movements.reduce((s, r) => s + r.claims_incurred, 0),
    csm_release: IFRS17_STATIC_DATA.liability_movements.reduce((s, r) => s + r.csm_release, 0),
    experience_variance: IFRS17_STATIC_DATA.liability_movements.reduce((s, r) => s + r.experience_variance, 0),
  };

  getCsmChangesInEstimates(portfolio: string, cohortYear: number): number | null {
    const row = this.cm.find((c) => c.portfolio === portfolio && c.cohort_year === cohortYear);
    return row?.changes_in_estimates ?? null;
  }
}
