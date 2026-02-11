import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import { LineSeries } from '../../models/chart.model';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    <div #chartContainer [style.height]="height()" class="w-full"></div>
  `,
  styles: [],
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chartContainer', { read: ElementRef }) chartContainer!: ElementRef<HTMLDivElement>;
  series = input.required<LineSeries[]>();
  xLabels = input<string[]>([]);
  title = input<string>();
  height = input<string>('300px');

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
    if (!this.plotly || !this.chartContainer?.nativeElement || !this.series()?.length) return;
    const s = this.series();
    const xLabels = this.xLabels();
    const traces = s.map((ser) => ({
      type: 'scatter',
      mode: 'lines',
      name: ser.name,
      x: xLabels.length ? xLabels : ser.data.map((_, i) => i),
      y: ser.data,
      line: { color: ser.color ?? '#3B82F6', width: 2 },
    }));
    const layout = {
      margin: { t: 20, b: 40, l: 50, r: 20 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: { showgrid: true, gridcolor: '#E5E7EB' },
      yaxis: { showgrid: true, gridcolor: '#E5E7EB' },
      showlegend: false,
    };
    (this.plotly as { newPlot: (el: HTMLElement, data: unknown[], layout: unknown, opts?: unknown) => void }).newPlot(
      this.chartContainer.nativeElement,
      traces,
      layout,
      { responsive: true }
    );
  }
}
