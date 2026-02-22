import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./features/signup/signup.routes').then((m) => m.SIGNUP_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'wallet',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/wallet/wallet.routes').then((m) => m.WALLET_ROUTES),
  },
  {
    path: 'transaction',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/transaction/transaction.routes').then((m) => m.TRANSACTION_ROUTES),
  },
  {
    path: 'crypto',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/crypto/crypto.routes').then((m) => m.CRYPTO_ROUTES),
  },
  {
    path: 'exchange',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/exchange/exchange.routes').then((m) => m.EXCHANGE_ROUTES),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
  },
  { path: '**', redirectTo: 'dashboard' },
];
