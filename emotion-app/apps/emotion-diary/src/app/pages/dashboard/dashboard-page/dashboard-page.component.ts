import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TuiRingChart } from '@taiga-ui/addon-charts';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { catchError, filter, of, switchMap } from 'rxjs';

import {
  EmotionState,
  getEmotionEmoji,
  getEmotionLabel,
} from '../../../core/constants/emotion-states';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
import { formatJournalDate } from '../../../core/utils/date-format.util';

type DayPeriod = 'night' | 'morning' | 'day' | 'evening';

interface HeatmapCell {
  day: number;
  period: DayPeriod;
  state: EmotionState | null;
  entry: JournalEntry | null;
  count: number;
}

const DAY_PERIODS: readonly {
  value: DayPeriod;
  label: string;
  from: number;
  to: number;
}[] = [
  { value: 'morning', label: 'Утро', from: 6, to: 12 },
  { value: 'day', label: 'День', from: 12, to: 18 },
  { value: 'evening', label: 'Вечер', from: 18, to: 24 },
  { value: 'night', label: 'Ночь', from: 0, to: 6 },
];

const EMOTION_STATE_ORDER: readonly EmotionState[] = [
  'joy',
  'calm',
  'neutral',
  'anxiety',
  'sadness',
];

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, TuiButton, TuiRingChart, TuiLoader],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly journalService = inject(JournalService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly userName = signal('Пользователь');
  protected readonly entries = signal<readonly JournalEntry[]>([]);
  protected readonly selectedMonth = signal(new Date());

  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected activeStateIndex = Number.NaN;

  protected readonly dayPeriods = DAY_PERIODS;

  protected readonly recentEntries = computed(() => this.entries().slice(0, 3));

  protected readonly heatmapMonth = computed(() =>
    this.selectedMonth().toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric',
    }),
  );

  protected readonly heatmapDays = computed<readonly number[]>(() => {
    const selectedMonth = this.selectedMonth();

    const daysCount = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0,
    ).getDate();

    return Array.from({ length: daysCount }, (_, index) => index + 1);
  });

  protected readonly heatmapCells = computed<readonly HeatmapCell[]>(() => {
    const selectedMonth = this.selectedMonth();
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    return this.dayPeriods.flatMap((period) =>
      this.heatmapDays().map((day) => {
        const entries = this.findEntriesByDayAndPeriod(
          year,
          month,
          day,
          period,
        );

        const latestEntry = entries.length ? entries[entries.length - 1] : null;

        return {
          day,
          period: period.value,
          state: latestEntry?.finalState ?? null,
          entry: latestEntry,
          count: entries.length,
        };
      }),
    );
  });

  protected readonly ringChartLabels = computed<readonly string[]>(() =>
    EMOTION_STATE_ORDER.map((state) => getEmotionLabel(state)),
  );

  protected readonly ringChartValue = computed<readonly number[]>(() =>
    EMOTION_STATE_ORDER.map(
      (state) =>
        this.entries().filter((entry) => entry.finalState === state).length,
    ),
  );

  protected get activeStateLabel(): string {
    return Number.isNaN(this.activeStateIndex)
      ? 'Все состояния'
      : (this.ringChartLabels()[this.activeStateIndex] ?? '');
  }

  protected get activeStateCount(): number {
    if (Number.isNaN(this.activeStateIndex)) {
      return this.ringChartValue().reduce((sum, item) => sum + item, 0);
    }

    return this.ringChartValue()[this.activeStateIndex] ?? 0;
  }

  constructor() {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== undefined),
        switchMap((user) => {
          this.isLoading.set(true);

          if (user === null) {
            this.errorMessage.set('Пользователь не авторизован');

            return of([]);
          }

          this.userName.set(user.displayName || user.email || 'Пользователь');

          return this.journalService.getUserEntries(user.uid).pipe(
            catchError(() => {
              this.errorMessage.set('Ошибка загрузки данных');

              return of([]);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((entries) => {
        this.entries.set(entries);
        this.isLoading.set(false);
      });
  }

  protected previousMonth(): void {
    const date = this.selectedMonth();

    this.selectedMonth.set(
      new Date(date.getFullYear(), date.getMonth() - 1, 1),
    );
  }

  protected nextMonth(): void {
    const date = this.selectedMonth();

    this.selectedMonth.set(
      new Date(date.getFullYear(), date.getMonth() + 1, 1),
    );
  }

  protected getHeatmapCell(day: number, period: DayPeriod): HeatmapCell | null {
    return (
      this.heatmapCells().find(
        (cell) => cell.day === day && cell.period === period,
      ) ?? null
    );
  }

  protected getHeatmapCellLabel(cell: HeatmapCell | null): string {
    if (cell === null || cell.entry === null || cell.state === null) {
      return 'Нет записи';
    }

    return `${cell.day}: ${getEmotionLabel(cell.state)}, записей: ${cell.count}`;
  }

  protected getStateEmoji(state: EmotionState): string {
    return getEmotionEmoji(state);
  }

  protected getStateLabel(state: EmotionState): string {
    return getEmotionLabel(state);
  }

  protected formatDate(entry: JournalEntry): string {
    return formatJournalDate(entry.createdAt);
  }

  private findEntriesByDayAndPeriod(
    year: number,
    month: number,
    day: number,
    period: (typeof DAY_PERIODS)[number],
  ): readonly JournalEntry[] {
    return this.entries()
      .filter((entry) => {
        const entryDate = entry.createdAt.toDate();
        const hour = entryDate.getHours();

        return (
          entryDate.getFullYear() === year &&
          entryDate.getMonth() === month &&
          entryDate.getDate() === day &&
          hour >= period.from &&
          hour < period.to
        );
      })
      .sort(
        (first, second) => first.createdAt.seconds - second.createdAt.seconds,
      );
  }
}
