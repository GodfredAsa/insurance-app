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
          class="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-gray-600 hover:bg-gray-50"
          [class.bg-blue-50]="item().active"
          [class.text-blue-600]="item().active"
          [class.font-medium]="item().active"
        >
          <div class="flex items-center gap-3">
            <i class="fas {{ item().icon }} w-5 text-center"></i>
            <span>{{ item().label }}</span>
          </div>
          <i class="fas fa-chevron-right text-xs text-gray-400 transition-transform" [class.rotate-90]="expanded"></i>
        </button>
        @if (expanded) {
          <ul class="ml-8 mt-1 space-y-0.5">
            @for (child of item().children; track child.label) {
              <li>
                <a
                  [routerLink]="child.link ?? '#'"
                  routerLinkActive="text-blue-600"
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
          routerLinkActive="bg-blue-50 text-blue-600 font-medium"
          [routerLinkActiveOptions]="{ exact: item().link === '/' || item().link === '/dashboard' }"
          class="flex items-center gap-3 py-2.5 px-3 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          <i class="fas {{ item().icon }} w-5 text-center"></i>
          <span>{{ item().label }}</span>
        </a>
      </li>
    }
  `,
  styles: [],
})
export class NavItemComponent {
  item = input.required<NavItemConfig>();
  expanded = true;
}
