import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../../shared/components/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../shared/components/line-chart/line-chart.component';
import { BarSeries, DonutChartItem, LineSeries } from '../../shared/models/chart.model';
import {
  Ifrs17Service,
  Ifrs17Dashboard,
  Ifrs17LiabilityReconciliation,
  Ifrs17CsmReconciliation,
  Ifrs17Data,
  Ifrs17LiabilityRow,
  Ifrs17CsmRow,
} from './ifrs17.service';

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

interface PremiumRow {
  contract_id: string;
  period: string;
  gross_premium: number;
  ceded_premium?: number;
  net_premium: number;
  received_date?: string;
}

interface ClaimRow {
  contract_id: string;
  claim_id: string;
  incurred_date?: string;
  incurred_amount: number;
  paid_amount?: number | null;
  outstanding_reserve?: number | null;
}

interface AcqRow {
  contract_id: string;
  commission: number;
  underwriting_cost: number;
  total: number;
}

interface ReinRow {
  contract_id: string;
  reinsurer: string;
  ceded_premium_ytd: number;
  recoveries_ytd: number;
  reinsurance_asset_balance: number;
}

interface DiscRow {
  term_years: number;
  rate_pct: number;
  as_at_date: string;
}

interface AssumpRow {
  portfolio: string;
  assumption_type: string;
  value_pct: number;
  effective_date: string;
  description: string;
}

interface DevRow {
  cohort_year: number;
  development_year_1?: number | null;
  development_year_2?: number | null;
  development_year_3?: number | null;
  incremental_claims: number;
}

interface ContractRow {
  contract_id: string;
  portfolio: string;
  product: string;
  cohort_year: number;
  measurement_model: string;
  inception_date: string;
  coverage_end_date: string;
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
  private readonly ifrs17 = inject(Ifrs17Service);

  readonly currentSection = signal<string>('summary');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly dashboard = signal<Ifrs17Dashboard | null>(null);
  readonly liabilityRecon = signal<Ifrs17LiabilityReconciliation | null>(null);
  readonly csmRecon = signal<Ifrs17CsmReconciliation | null>(null);
  readonly rawData = signal<Ifrs17Data | null>(null);

  readonly currency = computed(() => this.rawData()?.metadata?.currency ?? 'USD');
  readonly reportingDate = computed(() => this.rawData()?.metadata?.reporting_date ?? '—');
  readonly portfolios = computed(() => {
    const d = this.dashboard();
    const r = this.rawData();
    return (d?.summary?.portfolios ?? r?.metadata?.portfolios ?? []) as string[];
  });

  readonly lm = computed<Ifrs17LiabilityRow[]>(() => this.liabilityRecon()?.rows ?? []);
  readonly cm = computed<Ifrs17CsmRow[]>(() => this.csmRecon()?.rows ?? []);
  readonly prem = computed<PremiumRow[]>(() => (this.rawData()?.premiums ?? []) as PremiumRow[]);
  readonly cl = computed<ClaimRow[]>(() => (this.rawData()?.claims ?? []) as ClaimRow[]);
  readonly ac = computed<AcqRow[]>(() => (this.rawData()?.acquisition_costs ?? []) as AcqRow[]);
  readonly rein = computed<ReinRow[]>(() => (this.rawData()?.reinsurance ?? []) as ReinRow[]);
  readonly contracts = computed<ContractRow[]>(() => (this.rawData()?.contracts ?? []) as ContractRow[]);
  readonly assump = computed<AssumpRow[]>(() => (this.rawData()?.assumptions ?? []) as AssumpRow[]);
  readonly disc = computed<DiscRow[]>(() => (this.rawData()?.discount_rates ?? []) as DiscRow[]);
  readonly dev = computed<DevRow[]>(() => (this.rawData()?.claims_development ?? []) as DevRow[]);

  readonly totalLiabilityClose = computed(() => (this.liabilityRecon()?.totals ?? {})['closing_balance'] ?? 0);
  readonly totalLiabilityOpen = computed(() => (this.liabilityRecon()?.totals ?? {})['opening_balance'] ?? 0);
  readonly totalCSMClose = computed(() => (this.csmRecon()?.totals ?? {})['closing_csm'] ?? 0);
  readonly totalCSMOpen = computed(() => (this.csmRecon()?.totals ?? {})['opening_csm'] ?? 0);
  readonly totalCSMRelease = computed(() => this.csmRecon()?.insurance_revenue_from_csm_release ?? (this.csmRecon()?.totals ?? {})['csm_release_to_pl'] ?? 0);
  readonly totalGross = computed(() => this.dashboard()?.summary?.gross_premium ?? 0);
  readonly totalNet = computed(() => this.dashboard()?.summary?.net_premium ?? 0);
  readonly totalIncurred = computed(() => this.dashboard()?.summary?.claims_incurred ?? 0);
  readonly totalPaid = computed(() => this.dashboard()?.summary?.claims_paid ?? 0);
  readonly totalOutstanding = computed(() => this.dashboard()?.summary?.claims_outstanding_reserve ?? 0);
  readonly totalAcq = computed(() => this.dashboard()?.summary?.acquisition_costs_total ?? 0);
  readonly totalReinAsset = computed(() => this.dashboard()?.summary?.reinsurance_asset ?? 0);
  readonly totalCededYtd = computed(() => this.rein().reduce((s, r) => s + (r.ceded_premium_ytd ?? 0), 0));
  readonly totalRecoveries = computed(() => this.rein().reduce((s, r) => s + (r.recoveries_ytd ?? 0), 0));
  readonly contractsCount = computed(() => this.dashboard()?.summary?.contracts_count ?? this.contracts().length ?? 0);

  readonly lossRatioPct = computed(() => {
    const net = this.totalNet();
    const inc = this.totalIncurred();
    return net ? ((inc / net) * 100).toFixed(1) : '—';
  });
  readonly liabilityTrendPct = computed(() => {
    const s = this.dashboard()?.summary;
    return s?.liability_trend_pct ?? (this.totalLiabilityOpen() ? ((this.totalLiabilityClose() - this.totalLiabilityOpen()) / this.totalLiabilityOpen()) * 100 : null);
  });
  readonly csmTrendPct = computed(() => {
    const s = this.dashboard()?.summary;
    return s?.csm_trend_pct ?? (this.totalCSMOpen() ? ((this.totalCSMClose() - this.totalCSMOpen()) / this.totalCSMOpen()) * 100 : null);
  });

  readonly byPortfolio = computed<Record<string, ByPortfolio>>(() => {
    const ports = this.portfolios();
    const d = this.dashboard()?.summary?.by_portfolio;
    if (d) {
      const out: Record<string, ByPortfolio> = {};
      ports.forEach((p) => {
        const x = d[p];
        out[p] = {
          premium: x?.premium ?? 0,
          claims: x?.claims ?? 0,
          liability: x?.liability ?? 0,
          csm: x?.csm ?? 0,
          count: x?.count ?? 0,
          opening: x?.opening ?? 0,
        };
      });
      return out;
    }
    return Object.fromEntries(ports.map((p) => [p, { premium: 0, claims: 0, liability: 0, csm: 0, count: 0, opening: 0 }]));
  });

  readonly liabilityByCohort = computed(() => this.dashboard()?.liability_trend?.values ?? []);
  readonly csmByCohort = computed(() => this.dashboard()?.csm_trend?.values ?? []);
  readonly cohortLabels = computed(() => this.dashboard()?.liability_trend?.labels ?? this.dashboard()?.csm_trend?.labels ?? []);

  readonly portfolioComparison = computed<PortfolioComparisonRow[]>(() => {
    const api = this.dashboard()?.portfolio_comparison;
    if (api?.length) {
      return api.map((r) => ({
        portfolio: r.portfolio,
        contracts: r.contracts,
        gross_premium: r.gross_premium,
        claims: r.claims,
        loss_ratio_pct: r.loss_ratio_pct != null ? r.loss_ratio_pct + '%' : '—',
        closing_liability: r.closing_liability,
        closing_csm: r.closing_csm,
      }));
    }
    const bp = this.byPortfolio();
    return this.portfolios().map((port) => {
      const x = bp[port];
      const lossPct = x.premium ? ((x.claims / x.premium) * 100).toFixed(1) : '—';
      return {
        portfolio: port,
        contracts: x.count,
        gross_premium: x.premium,
        claims: x.claims,
        loss_ratio_pct: lossPct !== '—' ? lossPct + '%' : '—',
        closing_liability: x.liability,
        closing_csm: x.csm,
      };
    });
  });

  readonly donutPremiumData = computed<DonutChartItem[]>(() =>
    this.portfolios().map((p) => ({
      label: p,
      value: this.byPortfolio()[p]?.premium ?? 0,
      color: CHART_COLORS[p] ?? '#94a3b8',
    }))
  );
  readonly donutLiabilityData = computed<DonutChartItem[]>(() =>
    this.portfolios().map((p) => ({
      label: p,
      value: this.byPortfolio()[p]?.liability ?? 0,
      color: CHART_COLORS[p] ?? '#94a3b8',
    }))
  );
  readonly barPremiumClaimsSeries = computed<BarSeries[]>(() => [
    { name: 'Gross premium', data: this.portfolios().map((p) => this.byPortfolio()[p]?.premium ?? 0), color: 'rgba(66, 133, 244, 0.7)' },
    { name: 'Claims incurred', data: this.portfolios().map((p) => this.byPortfolio()[p]?.claims ?? 0), color: 'rgba(234, 67, 53, 0.7)' },
  ]);
  readonly barOpeningClosingSeries = computed<BarSeries[]>(() => [
    { name: 'Opening liability', data: this.portfolios().map((p) => this.byPortfolio()[p]?.opening ?? 0), color: 'rgba(158, 158, 158, 0.7)' },
    { name: 'Closing liability', data: this.portfolios().map((p) => this.byPortfolio()[p]?.liability ?? 0), color: 'rgba(52, 168, 83, 0.7)' },
  ]);
  readonly lineLiabilitySeries = computed<LineSeries[]>(() => [
    { name: 'Closing liability', data: this.liabilityByCohort(), color: 'rgb(66, 133, 244)' },
  ]);
  readonly lineCsmSeries = computed<LineSeries[]>(() => [
    { name: 'Closing CSM', data: this.csmByCohort(), color: 'rgb(52, 168, 83)' },
  ]);

  readonly fmtNum = fmtNum;
  readonly fmtPct = fmtPct;

  trendText(pct: number | null | undefined): string {
    if (pct == null) return '';
    const up = pct >= 0;
    return (up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(1) + '% vs opening';
  }

  readonly csmTotals = computed(() => {
    const t = this.csmRecon()?.totals ?? {};
    return {
      opening_csm: t['opening_csm'] ?? 0,
      initial_recognition: t['initial_recognition'] ?? 0,
      changes_in_estimates: t['changes_in_estimates'] ?? 0,
    };
  });

  readonly liabilityTotals = computed(() => {
    const t = this.liabilityRecon()?.totals ?? {};
    return {
      new_contracts: t['new_contracts'] ?? 0,
      premiums_received: t['premiums_received'] ?? 0,
      claims_incurred: t['claims_incurred'] ?? 0,
      csm_release: t['csm_release'] ?? 0,
      experience_variance: t['experience_variance'] ?? 0,
    };
  });

  getCsmChangesInEstimates(portfolio: string, cohortYear: number): number | null {
    const row = this.cm().find((c) => c.portfolio === portfolio && c.cohort_year === cohortYear);
    return row?.changes_in_estimates ?? null;
  }

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.currentSection.set((d['section'] as string) ?? 'summary');
    });

    forkJoin({
      dashboard: this.ifrs17.getDashboard(),
      liability: this.ifrs17.getReconciliationLiability(),
      csm: this.ifrs17.getReconciliationCsm(),
      data: this.ifrs17.getData(),
    }).subscribe({
      next: (result) => {
        this.dashboard.set(result.dashboard);
        this.liabilityRecon.set(result.liability);
        this.csmRecon.set(result.csm);
        this.rawData.set(result.data);
        if (!result.dashboard && !result.data) {
          this.error.set('Failed to load IFRS 17 data. Ensure the API is running and ifrs17_sample_data.json exists.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load IFRS 17 data.');
        this.loading.set(false);
      },
    });
  }
}
