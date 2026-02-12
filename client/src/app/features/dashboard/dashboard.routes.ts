import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Route[] = [
  { path: '', component: DashboardComponent, data: { section: 'summary' } },
  { path: 'liability', component: DashboardComponent, data: { section: 'liability' } },
  { path: 'csm', component: DashboardComponent, data: { section: 'csm' } },
  { path: 'revenue-expense', component: DashboardComponent, data: { section: 'revenue-expense' } },
  { path: 'development', component: DashboardComponent, data: { section: 'development' } },
  { path: 'experience', component: DashboardComponent, data: { section: 'experience' } },
  { path: 'reinsurance', component: DashboardComponent, data: { section: 'reinsurance' } },
  { path: 'concentration', component: DashboardComponent, data: { section: 'concentration' } },
  { path: 'discount', component: DashboardComponent, data: { section: 'discount' } },
  { path: 'assumptions', component: DashboardComponent, data: { section: 'assumptions' } },
  { path: 'balances', component: DashboardComponent, data: { section: 'balances' } },
  { path: 'new-business', component: DashboardComponent, data: { section: 'new-business' } },
  { path: 'reserves', component: DashboardComponent, data: { section: 'reserves' } },
];
