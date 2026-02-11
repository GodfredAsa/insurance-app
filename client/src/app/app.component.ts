import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarUser } from './shared/components/sidebar/sidebar.component';
import { NavItemConfig } from './shared/models/nav-item.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-[#F4F6F9] text-gray-800">
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        [user]="sidebarUser()"
        [navItems]="navItems()"
        [footerText]="'Boltz Crypto Admin Dashboard'"
        (toggle)="sidebarCollapsed.set(!sidebarCollapsed())"
      />
      <main
        class="flex-1 min-h-screen transition-all duration-300"
        [class.ml-64]="!sidebarCollapsed()"
        [class.ml-20]="sidebarCollapsed()"
      >
        <header class="sticky top-0 z-10 bg-[#F4F6F9] border-b border-gray-200 px-6 py-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="relative flex-1 max-w-md">
              <input
                type="search"
                placeholder="Find something here..."
                class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div class="flex items-center gap-3">
              <button type="button" class="relative p-2 rounded-lg hover:bg-white/80">
                <i class="fas fa-bell text-gray-600"></i>
                <span class="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">12</span>
              </button>
              <button type="button" class="p-2 rounded-lg hover:bg-white/80">
                <i class="fas fa-cog text-gray-600"></i>
              </button>
              <button type="button" class="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700">
                <i class="fas fa-sliders-h"></i>
                Filter Periode
              </button>
            </div>
          </div>
        </header>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  sidebarCollapsed = signal(false);
  sidebarUser: () => SidebarUser | null = () => ({
    name: 'William Francisson',
    email: 'williamfrancisson@mail.com',
    avatarUrl: 'https://ui-avatars.com/api/?name=William+Francisson&background=e0e7ff&color=4f46e5',
  });
  navItems = signal<NavItemConfig[]>([
    { icon: 'fa-th-large', label: 'Dashboard', link: '/dashboard' },
    {
      icon: 'fa-credit-card',
      label: 'My Wallet',
      children: [
        { icon: 'fa-plus', label: 'Add New', link: '/wallet/add' },
        { icon: 'fa-list', label: 'Card List', link: '/wallet' },
        { icon: 'fa-history', label: 'History', link: '/wallet/history' },
      ],
    },
    { icon: 'fa-exchange-alt', label: 'Transaction', link: '/transaction' },
    { icon: 'fa-coins', label: 'Crypto', link: '/crypto' },
    { icon: 'fa-chart-line', label: 'Exchange', link: '/exchange' },
    { icon: 'fa-cog', label: 'Settings', link: '/settings' },
  ]);
}
