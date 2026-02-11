import { Component, input } from '@angular/core';
import { CardTheme } from '../../models/card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="rounded-xl shadow-sm p-6 flex flex-col h-full relative overflow-hidden"
      [class.bg-white]="theme() === 'default'"
      [class.bg-green-600]="theme() === 'green'"
      [class.text-white]="theme() !== 'default'"
      [class.bg-blue-600]="theme() === 'blue'"
      [class.bg-purple-600]="theme() === 'purple'"
      [class.bg-orange-600]="theme() === 'orange'"
    >
      @if (theme() !== 'default') {
        <div class="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"></div>
      }
      @if (theme() === 'default' && icon()) {
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 min-w-0 flex-1">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              [class.bg-amber-100]="icon() === 'B'"
              [class.bg-orange-100]="icon() === 'M'"
              [class.bg-sky-100]="icon() === 'L'"
              [class.bg-green-100]="iconBg() === 'green'"
              [class.bg-orange-100]="iconBg() === 'orange'"
              [class.bg-blue-100]="iconBg() !== 'green' && iconBg() !== 'orange' && icon() !== 'B' && icon() !== 'M' && icon() !== 'L'"
              [class.text-green-600]="iconBg() === 'green'"
              [class.text-orange-600]="iconBg() === 'orange'"
            >
              @if (iconIsLetter()) {
                <span
                  class="font-bold"
                  [class.text-amber-600]="icon() === 'B'"
                  [class.text-orange-600]="icon() === 'M'"
                  [class.text-sky-600]="icon() === 'L'"
                  [class.text-blue-600]="icon() !== 'B' && icon() !== 'M' && icon() !== 'L'"
                >{{ icon() }}</span>
              } @else {
                <i class="fas {{ icon() }} text-lg" [class.text-green-600]="iconBg() === 'green'" [class.text-orange-600]="iconBg() === 'orange'" [class.text-blue-600]="iconBg() !== 'green' && iconBg() !== 'orange'"></i>
              }
            </div>
            <div class="min-w-0 flex-1">
              @if (title() && statCard()) {
                <p class="text-sm font-medium text-gray-500">{{ title() }}</p>
              }
              @if (value()) {
                <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ value() }}</p>
                @if (valueSubtext()) {
                  <p class="text-sm flex items-center gap-1 mt-0.5" [class.text-red-600]="trendDown()" [class.text-green-600]="!trendDown()">
                    @if (trendDown()) {
                      <i class="fas fa-arrow-down text-xs"></i>
                    } @else {
                      <i class="fas fa-arrow-up text-xs"></i>
                    }
                    {{ valueSubtext() }}
                  </p>
                }
              }
            </div>
          </div>
        </div>
      }
      @if (theme() === 'default' && title() && !icon()) {
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ title() }}</h2>
        @if (subtitle()) {
          <p class="text-sm text-gray-500 mt-0.5 mb-4">{{ subtitle() }}</p>
        }
      }
      @if (theme() !== 'default') {
        <p class="text-sm font-medium opacity-90">{{ title() || 'Main Balance' }}</p>
        @if (value()) {
          <p class="text-2xl font-bold mt-1">{{ value() }}</p>
        }
        @if (cardSubtext()) {
          <p class="text-xs mt-4 opacity-80">{{ cardSubtext() }}</p>
        }
        @if (cardHolder()) {
          <p class="text-sm mt-0 opacity-80">{{ cardHolder() }}</p>
        }
      }
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  title = input<string>();
  subtitle = input<string>();
  icon = input<string>();
  value = input<string>();
  valueSubtext = input<string>();
  theme = input<CardTheme>('default');
  cardSubtext = input<string>();
  cardHolder = input<string>();
  /** For stat cards: green or orange icon background */
  iconBg = input<'green' | 'orange' | null>(null);
  /** Trend down (red) vs up (green) for valueSubtext */
  trendDown = input<boolean>(false);
  /** When true, show title above value (stat card layout) */
  statCard = input<boolean>(false);

  iconIsLetter(): boolean {
    const i = this.icon();
    return i === 'B' || i === 'M' || i === 'L' || (!!i && i.length === 1 && i >= 'A' && i <= 'Z');
  }
}
