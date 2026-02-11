# Plan: Boltz Crypto Admin Dashboard (Angular)

Build the dashboard from the provided HTML as reusable Angular components with lazy-loaded feature modules. Charts use **Plotly**; layout uses **Tailwind** (already in place).

---

## 1. High-level structure

```
client/src/app/
├── app.component.ts          # Shell: sidebar + router-outlet (main content)
├── app.routes.ts             # Lazy routes: dashboard, wallet, transaction, etc.
├── core/                     # Singletons, guards, interceptors (optional)
├── shared/                   # SharedModule: reusable UI components
│   ├── shared.module.ts
│   ├── components/
│   │   ├── card/
│   │   ├── sidebar/
│   │   ├── nav-item/
│   │   ├── donut-chart/
│   │   └── line-chart/
│   └── ...
├── features/
│   ├── dashboard/            # Lazy: DashboardModule
│   ├── wallet/               # Lazy: WalletModule
│   ├── transaction/          # Lazy: TransactionModule
│   ├── crypto/                # Lazy: CryptoModule
│   ├── exchange/             # Lazy: ExchangeModule
│   └── settings/             # Lazy: SettingsModule
└── layout/                   # Optional: main layout wrapper
```

- **Shared**: Card, Sidebar, NavItem, DonutChart, LineChart (all reusable; data from parent).
- **Features**: One module per main nav section; each lazy-loaded via `loadChildren`.
- **App shell**: Renders `<app-sidebar>` + `<main><router-outlet></router-outlet></main>`.

---

## 2. Shared components (data from parent)

### 2.1 Sidebar component (`shared/components/sidebar`)

- **Responsibility**: Collapsible sidebar with logo, user block, nav list, footer.
- **Inputs**:
  - `collapsed: boolean` (or internal state with `@Output() collapsedChange`).
  - `user: { name: string; email: string; avatarUrl?: string }`.
  - `navItems: NavItemConfig[]` (see Nav Item below).
  - `footerText?: string`.
- **Behavior**: Toggle button (e.g. `fa-bars`) toggles `collapsed`; sidebar width animates (e.g. `w-64` ↔ `w-16` or similar). Main content area gets a class like `ml-64` / `ml-16` based on `collapsed` (or use CSS variable).
- **Content**: Logo, user block, `<app-nav-item>` for each top-level item (recursive for children), footer. No hardcoded nav copy; all from `navItems`.

### 2.2 Nav item component (`shared/components/nav-item`)

- **Responsibility**: Single nav entry (icon + label + optional link/children). Reusable for every item; parent passes one item per `<app-nav-item>`.
- **Inputs**:
  - `item: NavItemConfig` = `{ icon: string; label: string; link?: string; children?: NavItemConfig[]; active?: boolean }`.
  - `level?: number` (for indentation when nested).
- **Outputs**: `itemClick` (optional, for custom handling).
- **Template**: If `item.children?.length`, render expand/collapse (chevron) and recursive `<app-nav-item>` for each child; else render link or `routerLink`. Active state from `item.active` or `routerLinkActive`.
- **Usage**: Parent (e.g. Sidebar) loops: `@for (item of navItems) { <app-nav-item [item]="item" /> }`.

### 2.3 Card component (`shared/components/card`)

- **Responsibility**: Reusable card for stat blocks, balance cards, and any “box” (e.g. Current Statistic container, Market Overview container).
- **Inputs**:
  - `title?: string`
  - `subtitle?: string`
  - `icon?: string` (e.g. Font Awesome class)
  - `theme?: 'default' | 'green' | 'blue' | 'purple' | 'orange'` (for balance-style cards)
  - `value?: string` (e.g. "$22,466.24")
  - `valueSubtext?: string` (e.g. "45% This week")
- **Content**: `<ng-content>` for custom body (e.g. chart, table, list). If `value`/`valueSubtext` set, show them in a standard header block.
- **Usage**: Parent passes data and optional projection, e.g.:
  - Stat cards: `<app-card [title]="..." [value]="..." [valueSubtext]="..." [icon]="...">`
  - Balance cards: `<app-card [theme]="'green'" [value]="..." [title]="Main Balance">`
  - Chart containers: `<app-card [title]="Current Statistic"><app-donut-chart ...></app-donut-chart></app-card>`.

### 2.4 Donut chart component (`shared/components/donut-chart`)

- **Responsibility**: Donut/pie chart with **Plotly**; legends at **bottom** with labels and **percentages**.
- **Inputs**:
  - `data: DonutChartItem[]` = `{ label: string; value: number; color: string }[]`.
  - `title?: string`
  - `height?: string` (e.g. `'320px'`).
- **Behavior**: Compute percentages from `value` sum; render Plotly donut (e.g. `type: 'pie'`, `hole: 0.5`). Legend position: bottom; show `label` and `percentage` (e.g. "Income (66%)").
- **Tech**: Use `plotly.js` (and optionally a small wrapper or `ngx-plotly` if available for Angular 19) inside the component; data and layout (including legend) driven by inputs.

### 2.5 Line chart component (`shared/components/line-chart`)

- **Responsibility**: Reusable line chart (e.g. Market Overview) with **Plotly**.
- **Inputs**:
  - `series: LineSeries[]` = `{ name: string; data: number[]; color?: string }[]`.
  - `xLabels?: string[]`
  - `title?: string`
  - `height?: string`
- **Behavior**: Plotly line trace(s); axes and layout from inputs. Parent passes all data.

---

## 3. Feature modules (lazy-loaded)

Each feature is a lazy-loaded module with its own routing and a container component that composes shared components and receives data (from a service or static for now).

| Route        | Module           | Main component   | Content (from HTML) |
|-------------|------------------|------------------|---------------------|
| `/` or `/dashboard` | DashboardModule   | DashboardPageComponent | Stat cards, Current Statistic (donut), Market Overview (line), Main Balance cards, Recent Trading, Sell/Buy Order |
| `/wallet`   | WalletModule     | WalletPageComponent    | Placeholder / wallet-specific content |
| `/transaction` | TransactionModule | TransactionPageComponent | Placeholder |
| `/crypto`   | CryptoModule     | CryptoPageComponent    | Placeholder |
| `/exchange` | ExchangeModule   | ExchangePageComponent | Placeholder |
| `/settings` | SettingsModule   | SettingsPageComponent  | Placeholder |

- **Routing**: In `app.routes.ts` use `loadChildren` for each feature, e.g.:
  - `{ path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) }`
  - Or `loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)` and define routes inside the module.
- **Dashboard page**: Uses `<app-card>`, `<app-donut-chart>`, `<app-line-chart>`; data for cards, donut, and line chart defined in the component (or a dashboard service) and passed as inputs. No hardcoded HTML copy; structure only.

---

## 4. Lazy loading setup

- **app.routes.ts**:
  - Default route: `path: ''` redirect to `dashboard` or `path: 'dashboard'`.
  - `path: 'dashboard', loadChildren: () => import('...').then(...)`
  - Same for `wallet`, `transaction`, `crypto`, `exchange`, `settings`.
- Each feature:
  - **Feature routing**: e.g. `dashboard.routes.ts` with `path: ''` → `DashboardPageComponent` (or use a feature module with `RouterModule.forChild(...)`).
  - **Feature module**: Declares the page component and imports `SharedModule` and `RouterModule`. Exports nothing (or only if needed).
- **App component**: Only imports layout (sidebar + outlet); does not import feature modules (they load on demand).

---

## 5. Data flow (parent → child)

- **App or layout**: Holds `sidebarCollapsed`, `user`, `navItems` (and optionally `footerText`). Passes to `<app-sidebar>`.
- **Sidebar**: Passes each `navItems` entry to `<app-nav-item [item]="...">`.
- **Dashboard page**: Holds arrays for stat cards, donut data, line series, balance cards, recent activities, sell/buy rows. Passes to:
  - `<app-card [title]="..." [value]="..." ...>` (per card),
  - `<app-donut-chart [data]="donutData">`,
  - `<app-line-chart [series]="lineSeries" [xLabels]="xLabels">`,
  - and so on.
- **Interfaces**: Define in `shared/models` or per-feature (e.g. `NavItemConfig`, `DonutChartItem`, `LineSeries`, `CardConfig`) and use in both parent and child.

---

## 6. Dependencies to add

- **Plotly**: Add `plotly.js` (and `@types/plotly.js` if needed). Optionally `ngx-plotly` or similar for Angular if compatible with Angular 19; otherwise use Plotly in a wrapper component with `ElementRef` and `AfterViewInit`.
- **Font Awesome**: Already in HTML via CDN; can keep CDN in `index.html` or add `@fortawesome/fontawesome-free` (or Angular Font Awesome) for icons.
- **Tailwind**: Already configured; continue using utility classes in templates.

---

## 7. File checklist (summary)

| Item | Path / action |
|------|----------------|
| Shared module | `shared/shared.module.ts` (exports Card, Sidebar, NavItem, DonutChart, LineChart) |
| Sidebar | `shared/components/sidebar/` (collapsible; inputs: user, navItems, collapsed) |
| Nav item | `shared/components/nav-item/` (single item; input: item; recursive children) |
| Card | `shared/components/card/` (inputs: title, value, theme, etc.; ng-content) |
| Donut chart | `shared/components/donut-chart/` (Plotly; data + legend at bottom with %) |
| Line chart | `shared/components/line-chart/` (Plotly; series + xLabels from parent) |
| App routes | `app.routes.ts` with loadChildren for dashboard, wallet, transaction, crypto, exchange, settings |
| App component | Shell with sidebar + main + router-outlet |
| Dashboard (lazy) | `features/dashboard/dashboard.routes.ts` + `DashboardPageComponent` using shared components and passed data |
| Other features (lazy) | `features/wallet`, `transaction`, `crypto`, `exchange`, `settings` with minimal page components |

---

## 8. Order of implementation (suggested)

1. Add Plotly (and types) to `package.json`; add Font Awesome if not using CDN.
2. Create shared interfaces (e.g. `NavItemConfig`, `DonutChartItem`, `LineSeries`).
3. Implement **NavItemComponent** (standalone or in SharedModule) and use mock `navItems` in a test view.
4. Implement **SidebarComponent** (collapsible, user block, nav from `navItems`).
5. Implement **CardComponent** and use it for one stat card and one balance card.
6. Implement **DonutChartComponent** (Plotly, legend at bottom with percentages).
7. Implement **LineChartComponent** (Plotly, data from parent).
8. Create **DashboardModule** + **DashboardPageComponent**; compose all shared components; pass data from the component (or a small service).
9. Wire **app.routes.ts** with lazy `loadChildren` for dashboard and other features.
10. Update **AppComponent** to sidebar + main + router-outlet; default route to dashboard.
11. Add remaining feature modules (wallet, transaction, crypto, exchange, settings) with placeholder pages.

---

If you approve this plan, next step is implementing it in the `client` directory in this order (shared components first, then dashboard, then routing and shell).
