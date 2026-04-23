import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiAxes, TuiLineChart, TuiRingChart } from '@taiga-ui/addon-charts';
import { TuiButton, type TuiPoint } from '@taiga-ui/core';

interface RecentEntry {
  id: string;
  state: string;
  emoji: string;
  date: string;
  preview: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, TuiButton, TuiAxes, TuiLineChart, TuiRingChart],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly userName = 'dashk';

  protected readonly recentEntries: readonly RecentEntry[] = [
    {
      id: '1',
      state: 'Спокойствие',
      emoji: '😌',
      date: '12 апр 2026',
      preview: 'Сегодня чувствую себя лучше...',
    },
    {
      id: '2',
      state: 'Тревога',
      emoji: '😟',
      date: '11 апр 2026',
      preview: 'В первой половине дня было напряжённо...',
    },
  ];

  protected readonly lineChartValue: readonly TuiPoint[] = [
    [0, 20],
    [1, 45],
    [2, 32],
    [3, 68],
    [4, 58],
    [5, 82],
  ];

  protected readonly lineChartDates: readonly string[] = [
    '10',
    '12',
    '14',
    '16',
    '18',
    '20',
  ];

  protected readonly ringChartLabels: readonly string[] = [
    'Радость',
    'Спокойствие',
    'Нейтрально',
    'Тревога',
  ];

  protected readonly ringChartValue: readonly number[] = [4, 6, 3, 5];

  protected activeStateIndex = Number.NaN;

  protected get activeStateLabel(): string {
    return (
      (Number.isNaN(this.activeStateIndex)
        ? 'Все состояния'
        : this.ringChartLabels[this.activeStateIndex]) ?? ''
    );
  }

  protected get activeStateCount(): number {
    if (Number.isNaN(this.activeStateIndex)) {
      return this.ringChartValue.reduce((sum, item) => sum + item, 0);
    }

    return this.ringChartValue[this.activeStateIndex] ?? 0;
  }
}
