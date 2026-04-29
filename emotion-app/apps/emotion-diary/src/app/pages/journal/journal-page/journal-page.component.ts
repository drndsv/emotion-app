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
import { TuiButton, TuiInput, TuiLoader } from '@taiga-ui/core';
import { catchError, filter, of, startWith, switchMap } from 'rxjs';

import {
  DEFAULT_EMOTION_STATE_EMOJI,
  DEFAULT_EMOTION_STATE_LABEL,
  EMOTION_STATE_EMOJIS,
  EMOTION_STATE_LABELS,
} from '../../../core/constants/emotion-states';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
import { formatJournalDate } from '../../../core/utils/date-format.util';

@Component({
  selector: 'app-journal-page',
  imports: [TuiButton, RouterLink, TuiInput, ReactiveFormsModule, TuiLoader],
  templateUrl: './journal-page.component.html',
  styleUrl: './journal-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent {
  private readonly authService = inject(AuthService);
  private readonly journalService = inject(JournalService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: '' },
  );

  protected readonly entries = signal<readonly JournalEntry[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  protected readonly filteredEntries = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const entries = this.entries();

    if (!query) {
      return entries;
    }

    return entries.filter((entry) =>
      `${entry.finalState} ${this.formatDate(entry)} ${entry.text}`
        .toLowerCase()
        .includes(query),
    );
  });

  constructor() {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== null && user !== undefined),
        switchMap((user) =>
          this.journalService.getUserEntries(user.uid).pipe(
            catchError(() => {
              this.errorMessage.set('Ошибка загрузки записей');

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

  protected getStateEmoji(state: string): string {
    return EMOTION_STATE_EMOJIS[state] ?? DEFAULT_EMOTION_STATE_EMOJI;
  }

  protected getStateLabel(state: string): string {
    return EMOTION_STATE_LABELS[state] ?? DEFAULT_EMOTION_STATE_LABEL;
  }

  protected formatDate(entry: JournalEntry): string {
    return formatJournalDate(entry.createdAt);
  }
}
