import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarUser } from './shared/components/sidebar/sidebar.component';
import { NavItemConfig } from './shared/models/nav-item.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100 text-gray-800">
      <app-sidebar
        [collapsed]="sidebarCollapsed()"
        [user]="sidebarUser()"
        [navItems]="navItems()"
        [supportItems]="supportItems()"
        (toggle)="sidebarCollapsed.set(!sidebarCollapsed())"
      />
      <main
        class="flex-1 min-h-screen transition-all duration-300"
        [class.ml-64]="!sidebarCollapsed()"
        [class.ml-20]="sidebarCollapsed()"
      >
        <header class="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 px-6 py-4">
          <div class="flex items-center gap-6">
            <p class="text-lg font-medium text-gray-900 whitespace-nowrap">Hello, Mike!</p>
            <div class="flex-1 flex justify-center max-w-xl mx-auto">
              <div class="relative w-full">
                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="search"
                  placeholder="Search anything here..."
                  class="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" class="relative p-2 rounded-full hover:bg-white">
                <i class="fas fa-bell text-gray-600"></i>
              </button>
              <img
                [src]="getAvatarUrl()"
                alt="Profile"
                class="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
              />
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
    name: 'Mike',
    email: 'mike@example.com',
    avatarUrl: 'https://ui-avatars.com/api/?name=Mike&background=dcfce7&color=16a34a',
  });
  navItems = signal<NavItemConfig[]>([
    { icon: 'fa-th-large', label: 'Overview', link: '/dashboard' },
    { icon: 'fa-box-open', label: 'Orders', link: '/orders' },
    { icon: 'fa-envelope', label: 'Messages', link: '/messages' },
    { icon: 'fa-chart-bar', label: 'Statistics', link: '/statistics' },
    { icon: 'fa-user', label: 'Profile', link: '/profile' },
  ]);
  supportItems = signal<NavItemConfig[]>([
    { icon: 'fa-cog', label: 'Settings', link: '/settings' },
    { icon: 'fa-question-circle', label: 'Help', link: '/help' },
  ]);

  getAvatarUrl(): string {
    const u = this.sidebarUser();
    if (u?.avatarUrl) return u.avatarUrl;
    return 'https://ui-avatars.com/api/?name=Mike&background=dcfce7&color=16a34a';
  }
}
