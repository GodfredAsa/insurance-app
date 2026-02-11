import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { BarChartItem, BarSeries } from '../../models/chart.model';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    <div #chartContainer [style.height]="height()" class="w-full"></div>
  `,
  styles: [],
})
export class BarChartComponent implements AfterViewInit {
  @ViewChild('chartContainer', { read: ElementRef }) chartContainer!: ElementRef<HTMLDivElement>;
  /** Single series: pass items with label + value. Renders one bar per item. */
  data = input<BarChartItem[]>([]);
  /** Multiple series: pass array of { name, data, color? }. xLabels required. */
  series = input<BarSeries[]>([]);
  xLabels = input<string[]>([]);
  height = input<string>('300px');
  /** 'group' or 'stack' for multiple series */
  barmode = input<'group' | 'stack'>('group');

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
    if (!this.plotly || !this.chartContainer?.nativeElement) return;
    const single = this.data();
    const multi = this.series();
    const xLabels = this.xLabels();

    let traces: unknown[];
    if (single?.length) {
      traces = [{
        type: 'bar',
        x: single.map((i) => i.label),
        y: single.map((i) => i.value),
        marker: {
          color: single.every((i) => i.color)
            ? single.map((i) => i.color)
            : '#86efac',
        },
      }];
    } else if (multi?.length && xLabels?.length) {
      traces = multi.map((s) => ({
        type: 'bar',
        name: s.name,
        x: xLabels,
        y: s.data,
        marker: { color: s.color ?? '#86efac' },
      }));
    } else {
      return;
    }

    const layout = {
      margin: { t: 20, b: 50, l: 50, r: 20 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: { showgrid: false, tickangle: -45 },
      yaxis: { showgrid: true, gridcolor: '#E5E7EB' },
      barmode: this.barmode(),
      showlegend: multi?.length ? multi.length > 1 : false,
      legend: { orientation: 'h', y: 1.1 },
    };
    (this.plotly as { newPlot: (el: HTMLElement, data: unknown[], layout: unknown, opts?: unknown) => void }).newPlot(
      this.chartContainer.nativeElement,
      traces,
      layout,
      { responsive: true }
    );
  }
}
