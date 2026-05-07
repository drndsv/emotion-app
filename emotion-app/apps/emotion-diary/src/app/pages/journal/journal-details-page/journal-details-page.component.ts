import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmotionState } from '@emotion-app/shared';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import { getEmotionLabel } from '../../../core/constants/emotion-states';
import { JOURNAL_MESSAGES } from '../../../core/constants/journal';
import { JOURNAL_ENTRY_ID_PARAM } from '../../../core/constants/journal-form';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { JournalService } from '../../../core/services/journal.service';
import { formatJournalDate } from '../../../core/utils/date-format.util';

@Component({
  selector: 'app-journal-details-page',
  imports: [RouterLink, TuiButton, TuiLoader],
  templateUrl: './journal-details-page.component.html',
  styleUrl: './journal-details-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly journalService = inject(JournalService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly notFoundMessage = JOURNAL_MESSAGES.notFound;

  protected readonly entry = signal<JournalEntry | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isNotFound = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get(JOURNAL_ENTRY_ID_PARAM)),
        filter((id): id is string => id !== null),
        switchMap((id) =>
          this.journalService.getEntryById(id).pipe(
            catchError(() => {
              this.errorMessage.set(JOURNAL_MESSAGES.loadFailed);

              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((entry) => {
        this.isLoading.set(false);

        if (this.errorMessage()) {
          return;
        }

        if (entry === null) {
          this.isNotFound.set(true);

          return;
        }

        this.entry.set(entry);
      });
  }

  protected getStateLabel(state: EmotionState): string {
    return getEmotionLabel(state);
  }

  protected formatDate(entry: JournalEntry): string {
    return formatJournalDate(entry.createdAt);
  }
}
