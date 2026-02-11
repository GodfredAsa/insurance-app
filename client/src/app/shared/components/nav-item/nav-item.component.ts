import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItemConfig } from '../../models/nav-item.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    @if (item().children?.length) {
      <li>
        <button
          type="button"
          (click)="expanded = !expanded"
          class="flex items-center w-full py-2.5 rounded-lg text-gray-600 hover:bg-gray-50"
          [class.justify-between]="!collapsed()"
          [class.justify-center]="collapsed()"
          [class.px-3]="!collapsed()"
          [class.px-2]="collapsed()"
          [class.bg-green-50]="item().active && activeClass() === 'green'"
          [class.bg-blue-50]="item().active && activeClass() !== 'green'"
          [class.text-green-600]="item().active && activeClass() === 'green'"
          [class.text-blue-600]="item().active && activeClass() !== 'green'"
          [class.font-medium]="item().active"
        >
          <div class="flex items-center gap-3" [class.gap-0]="collapsed()">
            <i class="fas {{ item().icon }} w-5 text-center flex-shrink-0"></i>
            @if (!collapsed()) {
              <span>{{ item().label }}</span>
            }
          </div>
          @if (!collapsed()) {
            <i class="fas fa-chevron-right text-xs text-gray-400 transition-transform" [class.rotate-90]="expanded"></i>
          }
        </button>
        @if (expanded && !collapsed()) {
          <ul class="ml-8 mt-1 space-y-0.5">
            @for (child of item().children; track child.label) {
              <li>
                <a
                  [routerLink]="child.link ?? '#'"
                  [routerLinkActive]="activeClass() === 'green' ? 'text-green-600' : 'text-blue-600'"
                  class="block py-1.5 text-sm text-gray-500 hover:text-gray-700"
                >{{ child.label }}</a>
              </li>
            }
          </ul>
        }
      </li>
    } @else {
      <li>
        <a
          [routerLink]="item().link ?? '#'"
          [routerLinkActive]="activeClass() === 'green' ? 'bg-green-50 text-green-600 font-medium border-l-4 border-l-green-600' : 'bg-blue-50 text-blue-600 font-medium border-l-4 border-l-blue-600'"
          [routerLinkActiveOptions]="{ exact: item().link === '/' || item().link === '/dashboard' }"
          class="flex items-center py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
          [class.gap-3]="!collapsed()"
          [class.px-3]="!collapsed()"
          [class.justify-center]="collapsed()"
          [class.px-2]="collapsed()"
        >
          <i class="fas {{ item().icon }} w-5 text-center flex-shrink-0"></i>
          @if (!collapsed()) {
            <span>{{ item().label }}</span>
          }
        </a>
      </li>
    }
  `,
  styles: [],
})
export class NavItemComponent {
  item = input.required<NavItemConfig>();
  activeClass = input<'green' | 'blue'>('blue');
  collapsed = input<boolean>(false);
  expanded = true;
}
