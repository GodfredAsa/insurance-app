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
