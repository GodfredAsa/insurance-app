export type CardTheme = 'default' | 'green' | 'blue' | 'purple' | 'orange';

export interface CardData {
  title?: string;
  subtitle?: string;
  icon?: string;
  value?: string;
  valueSubtext?: string;
  theme?: CardTheme;
}
