import { Component, input, output } from '@angular/core';
import { NavItemConfig } from '../../models/nav-item.model';
import { NavItemComponent } from '../nav-item/nav-item.component';

export interface SidebarUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NavItemComponent],
  template: `
    <aside
      class="fixed left-0 top-0 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col z-10 transition-all duration-300 ease-in-out"
      [class.w-64]="!collapsed()"
      [class.w-20]="collapsed()"
    >
      <div class="p-5 border-b border-gray-100 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="text-xl font-bold text-gray-900 whitespace-nowrap">Boltz</span>
            @if (!collapsed()) {
              <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none"><path fill="#3B82F6" d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/></svg>
            }
          </div>
          <button type="button" (click)="toggle.emit()" class="p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle sidebar">
            <i class="fas fa-bars text-gray-600"></i>
          </button>
        </div>
      </div>
      @if (user(); as u) {
        <div class="p-5 flex items-center gap-3 border-b border-gray-100 flex-shrink-0">
          <img
            [src]="getAvatarUrl(u)"
            alt="Avatar"
            class="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          @if (!collapsed()) {
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 truncate">Hello, {{ u.name.split(' ')[0] }}</p>
              <p class="text-sm text-gray-500 truncate">{{ u.email }}</p>
            </div>
          }
        </div>
      }
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <ul class="space-y-0.5">
          @for (navItem of navItems(); track navItem.label) {
            <app-nav-item [item]="navItem" />
          }
        </ul>
      </nav>
      @if (footerText() && !collapsed()) {
        <div class="p-5 border-t border-gray-100 text-xs text-gray-400 space-y-1 flex-shrink-0">
          <p class="font-medium text-gray-500">Boltz Crypto Admin Dashboard</p>
          <p>© 2020 All Rights Reserved</p>
          <p>Made with <span class="text-red-500">❤️</span> by Peterdraw</p>
        </div>
      }
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {
  collapsed = input<boolean>(false);

  getAvatarUrl(user: SidebarUser): string {
    if (user.avatarUrl) return user.avatarUrl;
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=e0e7ff&color=4f46e5';
  }
  user = input<SidebarUser | null>(null);
  navItems = input<NavItemConfig[]>([]);
  footerText = input<string | null>(null);
  toggle = output<void>();
}
