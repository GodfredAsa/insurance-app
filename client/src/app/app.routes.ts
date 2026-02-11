import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'wallet',
    loadChildren: () =>
      import('./features/wallet/wallet.routes').then((m) => m.WALLET_ROUTES),
  },
  {
    path: 'transaction',
    loadChildren: () =>
      import('./features/transaction/transaction.routes').then((m) => m.TRANSACTION_ROUTES),
  },
  {
    path: 'crypto',
    loadChildren: () =>
      import('./features/crypto/crypto.routes').then((m) => m.CRYPTO_ROUTES),
  },
  {
    path: 'exchange',
    loadChildren: () =>
      import('./features/exchange/exchange.routes').then((m) => m.EXCHANGE_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
  },
  { path: '**', redirectTo: 'dashboard' },
];
