import { Component, input, output, signal } from '@angular/core';
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
      <div class="p-4 border-b border-gray-100 flex-shrink-0" [class.px-3]="collapsed()">
        <div class="flex items-center justify-between" [class.justify-center]="collapsed()">
          @if (collapsed()) {
            <button type="button" (click)="toggle.emit()" class="p-2 rounded-lg hover:bg-gray-100" aria-label="Expand sidebar">
              <i class="fas fa-bars text-gray-600"></i>
            </button>
          } @else {
            <span class="text-xl font-bold text-green-600 whitespace-nowrap truncate">SMILE FOOD</span>
            <button type="button" (click)="toggle.emit()" class="p-2 rounded-lg hover:bg-gray-100 flex-shrink-0" aria-label="Collapse sidebar">
              <i class="fas fa-bars text-gray-600"></i>
            </button>
          }
        </div>
      </div>
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <ul class="space-y-0.5">
          @for (navItem of navItems(); track navItem.label) {
            <app-nav-item [item]="navItem" [activeClass]="'green'" [collapsed]="collapsed()" />
          }
        </ul>
        @if (!collapsed()) {
          <p class="px-3 pt-4 pb-1 text-xs font-medium text-gray-400 uppercase tracking-wider">Support</p>
          <ul class="space-y-0.5">
            @for (supportItem of supportItems(); track supportItem.label) {
              <app-nav-item [item]="supportItem" [activeClass]="'green'" [collapsed]="false" />
            }
            <li class="flex items-center justify-between py-2.5 px-3 rounded-lg text-gray-600">
              <div class="flex items-center gap-3">
                <i class="fas fa-moon w-5 text-center"></i>
                <span>Dark mode</span>
              </div>
              <button
                type="button"
                role="switch"
                [attr.aria-checked]="darkMode()"
                (click)="darkMode.set(!darkMode())"
                class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                [class.bg-gray-200]="!darkMode()"
                [class.bg-green-600]="darkMode()"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition"
                  [class.translate-x-1]="!darkMode()"
                  [class.translate-x-6]="darkMode()"
                ></span>
              </button>
            </li>
          </ul>
        }
      </nav>
      @if (!collapsed()) {
        <div class="p-4 flex-shrink-0">
          <div class="rounded-xl bg-green-600 p-4 text-white">
            <p class="text-sm leading-snug">Earns 50 \$ when you refer! Refer a friends and get a bonus now!</p>
            <button type="button" class="mt-3 w-full rounded-lg bg-white/20 py-2 text-sm font-medium hover:bg-white/30">
              Show more
            </button>
          </div>
        </div>
      }
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {
  collapsed = input<boolean>(false);
  user = input<SidebarUser | null>(null);
  navItems = input<NavItemConfig[]>([]);
  supportItems = input<NavItemConfig[]>([]);
  footerText = input<string | null>(null);
  toggle = output<void>();
  darkMode = signal(false);

  getAvatarUrl(user: SidebarUser): string {
    if (user.avatarUrl) return user.avatarUrl;
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=dcfce7&color=16a34a';
  }
}
