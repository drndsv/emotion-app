import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { catchError, filter, map, of, switchMap } from 'rxjs';

import {
  DEFAULT_EMOTION_STATE_LABEL,
  EMOTION_STATE_LABELS,
} from '../../../core/constants/emotion-states';
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

  protected readonly entry = signal<JournalEntry | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isNotFound = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id): id is string => id !== null),
        switchMap((id) =>
          this.journalService.getEntryById(id).pipe(
            catchError(() => {
              this.errorMessage.set('Ошибка загрузки. Попробуйте позже');

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

  protected getStateLabel(state: string): string {
    return EMOTION_STATE_LABELS[state] ?? DEFAULT_EMOTION_STATE_LABEL;
  }

  protected formatDate(entry: JournalEntry): string {
    return formatJournalDate(entry.createdAt);
  }
}
