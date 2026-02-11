import { AfterViewInit, Component, computed, ElementRef, input, ViewChild } from '@angular/core';
import { DonutChartItem } from '../../models/chart.model';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  template: `
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div #chartContainer class="flex-shrink-0" [style.height.px]="chartHeight()"></div>
      <ul class="space-y-3 flex-1 min-w-0 w-full">
        @for (item of legendItems(); track item.label) {
          <li class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full flex-shrink-0" [style.background]="item.color"></span>
              <span class="text-sm text-gray-700">{{ item.label }} ({{ item.percentage }}%)</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ item.formattedValue }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [],
})
export class DonutChartComponent implements AfterViewInit {
  @ViewChild('chartContainer', { read: ElementRef }) chartContainer!: ElementRef<HTMLDivElement>;
  data = input.required<DonutChartItem[]>();
  title = input<string>();
  height = input<string>('320');
  chartHeight = input<number>(200);

  legendItems = computed(() => {
    const d = this.data();
    if (!d?.length) return [];
    const total = d.reduce((s, i) => s + i.value, 0);
    return d.map((i) => ({
      label: i.label,
      value: i.value,
      color: i.color,
      percentage: total ? Math.round((i.value / total) * 100) : 0,
      formattedValue: '$' + i.value.toLocaleString('en-US', { minimumFractionDigits: 2 }),
    }));
  });

  private plotly: typeof import('plotly.js-dist-min') | null = null;

  async ngAfterViewInit(): Promise<void> {
    try {
      this.plotly = await import('plotly.js-dist-min');
      this.draw();
    } catch {
      console.warn('Plotly not loaded');
    }
  }

  private draw(): void {
    if (!this.plotly || !this.chartContainer?.nativeElement || !this.data()?.length) return;
    const d = this.data();
    const trace = {
      type: 'pie',
      values: d.map((i) => i.value),
      labels: d.map((i) => i.label),
      marker: { colors: d.map((i) => i.color) },
      hole: 0.5,
      showlegend: false,
      textinfo: 'none',
    };
    const layout = {
      margin: { t: 10, b: 10, l: 10, r: 10 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      height: this.chartHeight(),
    };
    (this.plotly as { newPlot: (el: HTMLElement, data: unknown[], layout: unknown, opts?: unknown) => void }).newPlot(
      this.chartContainer.nativeElement,
      [trace],
      layout,
      { responsive: true }
    );
  }
}
