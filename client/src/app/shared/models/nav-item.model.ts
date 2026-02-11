export interface NavItemConfig {
  icon: string;
  label: string;
  link?: string;
  children?: NavItemConfig[];
  active?: boolean;
}
