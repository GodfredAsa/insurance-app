import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { DonutChartComponent } from '../../shared/components/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../shared/components/line-chart/line-chart.component';
import { DonutChartItem, LineSeries } from '../../shared/models/chart.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, CardComponent, DonutChartComponent, LineChartComponent],
  template: `
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of statCards; track stat.value) {
          <app-card
            [icon]="stat.icon"
            [value]="stat.value"
            [valueSubtext]="stat.valueSubtext"
          />
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-card title="Current Statistic" subtitle="Lorem ipsum">
          <app-donut-chart [data]="donutData" [chartHeight]="200" />
        </app-card>
        <app-card title="Market Overview" subtitle="Lorem ipsum dolor sit amet, consectetur">
          <div class="flex justify-end mb-2">
            <button type="button" class="text-sm text-gray-600 flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50">
              Weekly (2020)
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          <app-line-chart [series]="lineSeries" [xLabels]="lineXLabels" height="240px" />
        </app-card>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (balance of balanceCards; track balance.theme) {
          <app-card
            [theme]="balance.theme"
            [title]="balance.title"
            [value]="balance.value"
            cardSubtext="VALID THRU 08/21"
            [cardHolder]="balance.cardHolder"
          />
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <app-card title="Recent Trading Activities" subtitle="Lorem ipsum dolor sit amet, consectetur">
          <div class="flex gap-2 mb-4">
            <button type="button" class="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">Monthly</button>
            <button type="button" class="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">Weekly</button>
            <button type="button" class="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">Today</button>
          </div>
          <ul class="space-y-4">
            @for (act of recentActivities; track act.name) {
              <li class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" [ngClass]="act.iconBg">
                  <span class="font-bold text-sm" [ngClass]="act.iconColor">{{ act.iconLetter }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900">{{ act.name }}</p>
                  <p class="text-xs text-gray-500">{{ act.time }}</p>
                </div>
                <span class="font-semibold" [ngClass]="act.amountClass">{{ act.amount }}</span>
                <span class="rounded-full text-xs font-medium px-2.5 py-1" [ngClass]="act.badgeClass">{{ act.status }}</span>
              </li>
            }
          </ul>
        </app-card>
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <app-card title="Sell Order">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <span class="text-sky-600 font-bold text-sm">L</span>
              </div>
              <span class="text-sm font-medium text-gray-700">Litecoin</span>
            </div>
            <table class="w-full text-sm">
              <thead>
                <tr class="text-gray-500 border-b border-gray-100">
                  <th class="text-left py-2 font-medium">Price</th>
                  <th class="text-left py-2 font-medium">Amount</th>
                  <th class="text-left py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                @for (row of sellOrders; track row.price) {
                  <tr class="border-b border-gray-50">
                    <td class="py-2">{{ row.price }}</td>
                    <td class="py-2">{{ row.amount }}</td>
                    <td class="py-2">{{ row.total }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </app-card>
          <app-card title="Buy Order">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <span class="text-orange-600 font-bold text-sm">M</span>
              </div>
              <span class="text-sm font-medium text-gray-700">Monero</span>
            </div>
            <table class="w-full text-sm">
              <thead>
                <tr class="text-gray-500 border-b border-gray-100">
                  <th class="text-left py-2 font-medium">Price</th>
                  <th class="text-left py-2 font-medium">Amount</th>
                  <th class="text-left py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                @for (row of buyOrders; track row.price) {
                  <tr class="border-b border-gray-50">
                    <td class="py-2">{{ row.price }}</td>
                    <td class="py-2">{{ row.amount }}</td>
                    <td class="py-2">{{ row.total }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  statCards = [
    { icon: 'B', value: '$984', valueSubtext: '45% This week' },
    { icon: 'M', value: '$22,567', valueSubtext: '45% This week' },
    { icon: 'fa-arrow-up', value: '$168,331.09', valueSubtext: '45% This week' },
    { icon: 'L', value: '$7,784', valueSubtext: '45% This week' },
  ];

  donutData: DonutChartItem[] = [
    { label: 'Income', value: 167884.21, color: '#F97316' },
    { label: 'Spends', value: 56411.33, color: '#3B82F6' },
    { label: 'Installment', value: 81981.22, color: '#22C55E' },
    { label: 'Invest', value: 12432.51, color: '#EC4899' },
  ];

  lineSeries: LineSeries[] = [
    { name: 'Series 1', data: [95, 90, 70, 45, 35, 28], color: '#3B82F6' },
    { name: 'Series 2', data: [85, 75, 55, 40, 32, 25], color: '#F97316' },
  ];
  lineXLabels = ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Week 05', 'Week 10'];

  balanceCards = [
    { theme: 'green' as const, title: 'Main Balance', value: '$22,466.24', cardHolder: 'CARD HOLDER William Fancyson' },
    { theme: 'blue' as const, title: 'Main Balance', value: '$22,466.24', cardHolder: 'CARD HOLDER William Fancyson' },
    { theme: 'purple' as const, title: 'Main Balance', value: '$22,466.24', cardHolder: 'CARD HOLDER William Fancyson' },
    { theme: 'orange' as const, title: 'Main Balance', value: '$22,466.24', cardHolder: 'CARD HOLDER William Fancyson' },
  ];

  recentActivities = [
    { name: 'Bitcoin', time: '06:24:45 AM', amount: '+$5,553', status: 'Completed', iconLetter: 'B', iconBg: 'bg-green-100', iconColor: 'text-green-600', amountClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-700' },
    { name: 'Monero', time: '05:12:30 AM', amount: '-$1,200', status: 'Pending', iconLetter: 'M', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', amountClass: 'text-red-600', badgeClass: 'bg-amber-100 text-amber-700' },
    { name: 'Litecoin', time: '04:58:12 AM', amount: '+$2,100', status: 'Completed', iconLetter: 'L', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', amountClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-700' },
  ];

  sellOrders = [
    { price: '$42,150.00', amount: '0.024', total: '$1,011.60' },
    { price: '$42,140.00', amount: '0.051', total: '$2,149.14' },
    { price: '$42,130.00', amount: '0.010', total: '$421.30' },
  ];
  buyOrders = [
    { price: '$158.20', amount: '2.50', total: '$395.50' },
    { price: '$158.10', amount: '1.20', total: '$189.72' },
    { price: '$158.00', amount: '0.80', total: '$126.40' },
  ];
}
