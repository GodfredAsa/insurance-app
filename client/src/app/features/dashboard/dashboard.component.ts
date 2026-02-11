import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { BarChartComponent } from '../../shared/components/bar-chart/bar-chart.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { DonutChartComponent } from '../../shared/components/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../shared/components/line-chart/line-chart.component';
import { BarChartItem, DonutChartItem, LineSeries } from '../../shared/models/chart.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, BarChartComponent, CardComponent, DonutChartComponent, LineChartComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <i class="fas fa-filter text-gray-500"></i>
          Filters
        </button>
        <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <i class="fas fa-calendar-alt text-gray-500"></i>
          Last 30 days
          <i class="fas fa-chevron-down text-xs text-gray-400"></i>
        </button>
        <button type="button" class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700">
          <i class="fas fa-file-export"></i>
          Export PDF
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        @for (stat of statCards; track stat.title) {
          <app-card
            [title]="stat.title"
            [icon]="stat.icon"
            [value]="stat.value"
            [valueSubtext]="stat.valueSubtext"
            [iconBg]="stat.iconBg"
            [trendDown]="stat.trendDown"
            [statCard]="true"
          />
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Statistics</h2>
            <a href="#" class="text-sm font-medium text-green-600 hover:text-green-700">more &gt;</a>
          </div>
          <app-donut-chart
            [data]="donutData"
            [chartHeight]="260"
            centerTitle="Total orders"
            centerValue="857"
          />
        </app-card>
        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Orders history</h2>
            <a href="#" class="text-sm font-medium text-green-600 hover:text-green-700">more &gt;</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-500 border-b border-gray-200">
                  <th class="pb-3 font-medium">Order number</th>
                  <th class="pb-3 font-medium">Status</th>
                  <th class="pb-3 font-medium">Date and Time</th>
                  <th class="pb-3 font-medium">Amount</th>
                  <th class="pb-3 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                @for (row of ordersHistory; track row.orderNumber) {
                  <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                    <td class="py-3 font-medium">{{ row.orderNumber }}</td>
                    <td class="py-3">
                      <span class="inline-flex items-center gap-1.5" [ngClass]="row.statusClass">
                        <i class="fas text-xs" [ngClass]="row.statusIcon"></i>
                        {{ row.status }}
                      </span>
                    </td>
                    <td class="py-3">{{ row.dateTime }}</td>
                    <td class="py-3">{{ row.amount }}</td>
                    <td class="py-3">
                      <button type="button" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Insurance contribution trend</h2>
            <a href="#" class="text-sm font-medium text-green-600 hover:text-green-700">more &gt;</a>
          </div>
          <app-line-chart
            [series]="insuranceContributionTrend"
            [xLabels]="contributionMonths"
            height="280px"
          />
        </app-card>
        <app-card>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Monthly contribution</h2>
            <a href="#" class="text-sm font-medium text-green-600 hover:text-green-700">more &gt;</a>
          </div>
          <app-bar-chart
            [data]="monthlyContributionBars"
            height="280px"
          />
        </app-card>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  statCards = [
    {
      title: 'Monthly Delivery',
      value: '857 orders',
      valueSubtext: '-10% vs past month',
      icon: 'fa-truck',
      iconBg: 'green' as const,
      trendDown: true,
    },
    {
      title: 'Monthly work hours',
      value: '158 hours',
      valueSubtext: '+20% vs past month',
      icon: 'fa-calendar-alt',
      iconBg: 'orange' as const,
      trendDown: false,
    },
    {
      title: 'Earned funds',
      value: '1,5k $',
      valueSubtext: '+5% vs past month',
      icon: 'fa-dollar-sign',
      iconBg: 'green' as const,
      trendDown: false,
    },
  ];

  donutData: DonutChartItem[] = [
    { label: 'Central area', value: 52, color: '#22C55E' },
    { label: 'South-Western area', value: 15, color: '#86EFAC' },
    { label: 'Eastern area', value: 33, color: '#F97316' },
  ];

  contributionMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  insuranceContributionTrend: LineSeries[] = [
    {
      name: 'Contribution',
      data: [420, 445, 438, 460, 472, 488, 495, 510, 518, 532, 540, 558],
      color: '#22C55E',
    },
  ];
  monthlyContributionBars: BarChartItem[] = [
    { label: 'Jan', value: 420 },
    { label: 'Feb', value: 445 },
    { label: 'Mar', value: 438 },
    { label: 'Apr', value: 460 },
    { label: 'May', value: 472 },
    { label: 'Jun', value: 488 },
    { label: 'Jul', value: 495 },
    { label: 'Aug', value: 510 },
    { label: 'Sep', value: 518 },
    { label: 'Oct', value: 532 },
    { label: 'Nov', value: 540 },
    { label: 'Dec', value: 558 },
  ];

  ordersHistory = [
    { orderNumber: '#12345678', status: 'Completed', statusClass: 'text-green-600', statusIcon: 'fa-check-circle', dateTime: '1/10/2024 at 5:12 PM', amount: '$ 32,85' },
    { orderNumber: '#12345679', status: 'Pending', statusClass: 'text-amber-600', statusIcon: 'fa-clock', dateTime: '1/10/2024 at 4:32 PM', amount: '$ 18,50' },
    { orderNumber: '#12345680', status: 'Failed', statusClass: 'text-red-600', statusIcon: 'fa-times-circle', dateTime: '1/10/2024 at 3:45 PM', amount: '$ 42,00' },
    { orderNumber: '#12345681', status: 'Completed', statusClass: 'text-green-600', statusIcon: 'fa-check-circle', dateTime: '1/10/2024 at 2:20 PM', amount: '$ 25,30' },
    { orderNumber: '#12345682', status: 'Pending', statusClass: 'text-amber-600', statusIcon: 'fa-clock', dateTime: '1/10/2024 at 1:15 PM', amount: '$ 67,90' },
  ];
}
