import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmotionState } from '@emotion-app/shared';
import { TuiButton, TuiInput, TuiLoader } from '@taiga-ui/core';
import { TuiPagination } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { catchError, filter, of, startWith, switchMap } from 'rxjs';

import {
  getEmotionEmoji,
  getEmotionLabel,
} from '../../../core/constants/emotion-states';
import {
  JOURNAL_INITIAL_PAGE,
  JOURNAL_MESSAGES,
  JOURNAL_MIN_PAGES_FOR_PAGINATION,
  JOURNAL_PAGE_SIZE,
} from '../../../core/constants/journal';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
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
  ],
  templateUrl: './journal-page.component.html',
  styleUrl: './journal-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent {
  private readonly authService = inject(AuthService);
  private readonly journalService = inject(JournalService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSize = JOURNAL_PAGE_SIZE;
  protected readonly currentPage = signal(JOURNAL_INITIAL_PAGE);

  protected readonly minPagesForPagination = JOURNAL_MIN_PAGES_FOR_PAGINATION;

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: '' },
  );

  protected readonly entries = signal<readonly JournalEntry[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly filteredEntries = computed(() =>
    filterJournalEntries(
      this.entries(),
      this.searchQuery(),
      this.formatDate.bind(this),
    ),
  );

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

  constructor() {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== null && user !== undefined),
        switchMap((user) =>
          this.journalService.getUserEntries(user.uid).pipe(
            catchError(() => {
              this.errorMessage.set(JOURNAL_MESSAGES.loadFailed);

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
