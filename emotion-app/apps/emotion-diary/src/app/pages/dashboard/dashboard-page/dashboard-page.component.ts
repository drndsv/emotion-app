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
import { EmotionState } from '@emotion-app/shared';
import { TuiRingChart } from '@taiga-ui/addon-charts';
import { TuiButton, TuiHint, TuiLoader } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { catchError, filter, of, switchMap } from 'rxjs';

import {
  createHeatmapCellLabel,
  DASHBOARD_ALL_STATES_LABEL,
  DASHBOARD_DATE_LOCALE,
  DASHBOARD_DEFAULT_USER_NAME,
  DASHBOARD_EMPTY_CELL_LABEL,
  DASHBOARD_LOAD_ERROR_MESSAGE,
  DASHBOARD_MONTH_FORMAT_OPTIONS,
  DASHBOARD_NOT_AUTHORIZED_MESSAGE,
  DASHBOARD_RECENT_ENTRIES_LIMIT,
} from '../../../core/constants/dashboard';
import { DAY_PERIODS } from '../../../core/constants/day-periods';
import {
  EMOTION_STATE_ORDER,
  getEmotionEmoji,
  getEmotionLabel,
} from '../../../core/constants/emotion-states';
import { DayPeriod } from '../../../core/models/day-period.model';
import { HeatmapCell } from '../../../core/models/heatmap-cell.model';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
import {
  getDaysInMonth,
  getNextMonth,
  getPreviousMonth,
} from '../../../core/utils/dashboard-date.util';
import { formatJournalTime } from '../../../core/utils/date-format.util';
import { groupJournalEntriesByDate } from '../../../core/utils/group-journal-entries.util';
import { buildHeatmapCells } from '../../../core/utils/heatmap.util';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    TuiButton,
    TuiRingChart,
    TuiLoader,
    TuiCardLarge,
    TuiHint,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly journalService = inject(JournalService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly userName = signal(DASHBOARD_DEFAULT_USER_NAME);
  protected readonly entries = signal<readonly JournalEntry[]>([]);
  protected readonly selectedMonth = signal(new Date());

  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected activeStateIndex = Number.NaN;

  protected readonly dayPeriods = DAY_PERIODS;
  protected readonly emotionStateOrder = EMOTION_STATE_ORDER;

  protected readonly groupedRecentEntries = computed(() =>
    groupJournalEntriesByDate(
      this.entries().slice(0, DASHBOARD_RECENT_ENTRIES_LIMIT),
    ),
  );

  protected readonly heatmapMonth = computed(() =>
    this.selectedMonth().toLocaleDateString(
      DASHBOARD_DATE_LOCALE,
      DASHBOARD_MONTH_FORMAT_OPTIONS,
    ),
  );

  protected readonly heatmapDays = computed(() =>
    getDaysInMonth(this.selectedMonth()),
  );

  protected readonly heatmapCells = computed(() =>
    buildHeatmapCells({
      entries: this.entries(),
      days: this.heatmapDays(),
      periods: this.dayPeriods,
      selectedMonth: this.selectedMonth(),
    }),
  );

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
      ? DASHBOARD_ALL_STATES_LABEL
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
            this.errorMessage.set(DASHBOARD_NOT_AUTHORIZED_MESSAGE);

            return of([]);
          }

          this.userName.set(
            user.displayName || user.email || DASHBOARD_DEFAULT_USER_NAME,
          );

          return this.journalService.getUserEntries(user.uid).pipe(
            catchError(() => {
              this.errorMessage.set(DASHBOARD_LOAD_ERROR_MESSAGE);

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
    this.selectedMonth.set(getPreviousMonth(this.selectedMonth()));
  }

  protected nextMonth(): void {
    this.selectedMonth.set(getNextMonth(this.selectedMonth()));
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
      return DASHBOARD_EMPTY_CELL_LABEL;
    }

    return createHeatmapCellLabel({
      day: cell.day,
      stateLabel: getEmotionLabel(cell.state),
      count: cell.count,
    });
  }

  protected getStateEmoji(state: EmotionState): string {
    return getEmotionEmoji(state);
  }

  protected getStateLabel(state: EmotionState): string {
    return getEmotionLabel(state);
  }

  protected formatTime(entry: JournalEntry): string {
    return formatJournalTime(entry.createdAt);
  }
}
