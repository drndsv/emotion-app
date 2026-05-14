import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmotionState } from '@emotion-app/shared';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiButton, TuiInput, TuiLoader, TuiCalendar } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiInputDate,
  TuiPagination,
  TuiSelect,
} from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { catchError, filter, merge, of, startWith, switchMap } from 'rxjs';

import {
  EMOTION_STATE_LABELS,
  getEmotionEmoji,
  getEmotionLabel,
  getEmotionStateByLabel,
} from '../../../core/constants/emotion-states';
import {
  JOURNAL_ALL_STATES_LABEL,
  JOURNAL_INITIAL_PAGE,
  JOURNAL_MESSAGES,
  JOURNAL_MIN_PAGES_FOR_PAGINATION,
  JOURNAL_PAGE_SIZE,
} from '../../../core/constants/journal';
import { LOGGER_EVENTS } from '../../../core/constants/logger';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
import { LoggerService } from '../../../core/services/logger.service';
import {
  formatJournalDate,
  formatJournalTime,
} from '../../../core/utils/date-format.util';
import { groupJournalEntriesByDate } from '../../../core/utils/group-journal-entries.util';
import { filterJournalEntries } from '../../../core/utils/journal-search.util';

@Component({
  selector: 'app-journal-page',
  imports: [
    TuiButton,
    RouterLink,
    TuiInput,
    ReactiveFormsModule,
    TuiLoader,
    TuiCardLarge,
    TuiPagination,
    TuiChevron,
    TuiSelect,
    TuiDataListWrapper,
    TuiInputDate,
    TuiCalendar,
  ],
  templateUrl: './journal-page.component.html',
  styleUrl: './journal-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly journalService = inject(JournalService);
  private readonly loggerService = inject(LoggerService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = JOURNAL_PAGE_SIZE;
  protected readonly currentPage = signal(JOURNAL_INITIAL_PAGE);

  protected readonly minPagesForPagination = JOURNAL_MIN_PAGES_FOR_PAGINATION;

  protected readonly stateFilterItems = [
    JOURNAL_ALL_STATES_LABEL,
    ...EMOTION_STATE_LABELS,
  ];

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  protected readonly stateFilterControl = new FormControl(
    JOURNAL_ALL_STATES_LABEL,
    { nonNullable: true },
  );

  protected readonly dateFilterControl = new FormControl<TuiDay | null>(null);

  private readonly searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: '' },
  );

  private readonly selectedStateLabel = toSignal(
    this.stateFilterControl.valueChanges.pipe(
      startWith(this.stateFilterControl.value),
    ),
    { initialValue: JOURNAL_ALL_STATES_LABEL },
  );

  private readonly selectedDate = toSignal(
    this.dateFilterControl.valueChanges.pipe(
      startWith(this.dateFilterControl.value),
    ),
    { initialValue: null },
  );

  protected readonly entries = signal<readonly JournalEntry[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly filteredEntries = computed(() => {
    const selectedState =
      this.selectedStateLabel() === JOURNAL_ALL_STATES_LABEL
        ? null
        : getEmotionStateByLabel(this.selectedStateLabel());

    return filterJournalEntries({
      entries: this.entries(),
      query: this.searchQuery(),
      formatDate: this.formatDate.bind(this),
      selectedState,
      selectedDate: this.selectedDate(),
    });
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredEntries().length / this.pageSize),
  );

  protected readonly paginatedEntries = computed(() => {
    const startIndex = this.currentPage() * this.pageSize;

    return this.filteredEntries().slice(startIndex, startIndex + this.pageSize);
  });

  protected readonly groupedEntries = computed(() =>
    groupJournalEntriesByDate(this.paginatedEntries()),
  );

  ngOnInit(): void {
    merge(
      this.searchControl.valueChanges,
      this.stateFilterControl.valueChanges,
      this.dateFilterControl.valueChanges,
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentPage.set(JOURNAL_INITIAL_PAGE);
      });

    this.authService.currentUser$
      .pipe(
        filter((user) => user !== null && user !== undefined),
        switchMap((user) =>
          this.journalService.getUserEntries(user.uid).pipe(
            catchError((error: unknown) => {
              this.errorMessage.set(JOURNAL_MESSAGES.loadFailed);

              this.loggerService
                .logError(LOGGER_EVENTS.journalEntriesLoadFailed, error)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();

              return of([]);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((entries) => {
        this.isLoading.set(false);
        this.entries.set(entries);
      });
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

  protected formatTime(entry: JournalEntry): string {
    return formatJournalTime(entry.createdAt);
  }
}
