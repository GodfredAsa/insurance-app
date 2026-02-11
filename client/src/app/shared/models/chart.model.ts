export interface DonutChartItem {
  label: string;
  value: number;
  color: string;
}

export interface LineSeries {
  name: string;
  data: number[];
  color?: string;
}

/** Single bar series: label (x) and value (y). For multiple series use BarSeries[]. */
export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

/** Multiple bar series for grouped/stacked bars. Each series has a name and values per x category. */
export interface BarSeries {
  name: string;
  data: number[];
  color?: string;
}
