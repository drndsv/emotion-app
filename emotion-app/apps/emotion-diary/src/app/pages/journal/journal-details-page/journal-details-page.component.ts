import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmotionState } from '@emotion-app/shared';
import {
  TuiButton,
  TuiDialogService,
  TuiLoader,
  TuiNotificationService,
} from '@taiga-ui/core';
import { TUI_CONFIRM, TuiConfirmData } from '@taiga-ui/kit';
import { catchError, EMPTY, filter, map, of, switchMap } from 'rxjs';

import { getEmotionLabel } from '../../../core/constants/emotion-states';
import {
  JOURNAL_DETAILS_DIALOG_SIZE,
  JOURNAL_MESSAGES,
} from '../../../core/constants/journal';
import { JOURNAL_ENTRY_ID_PARAM } from '../../../core/constants/journal-form';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { JournalService } from '../../../core/services/journal.service';
import {
  formatJournalDate,
  formatJournalTime,
} from '../../../core/utils/date-format.util';

@Component({
  selector: 'app-journal-details-page',
  imports: [RouterLink, TuiButton, TuiLoader],
  templateUrl: './journal-details-page.component.html',
  styleUrl: './journal-details-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly journalService = inject(JournalService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly notifications = inject(TuiNotificationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly notFoundMessage = JOURNAL_MESSAGES.notFound;

  protected readonly entry = signal<JournalEntry | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isDeleting = signal(false);
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

  protected deleteEntry(): void {
    const currentEntry = this.entry();

    if (currentEntry === null) {
      return;
    }

    const data: TuiConfirmData = {
      content: JOURNAL_MESSAGES.deleteConfirmContent,
      yes: JOURNAL_MESSAGES.deleteConfirmYes,
      no: JOURNAL_MESSAGES.deleteConfirmNo,
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: JOURNAL_MESSAGES.deleteConfirmTitle,
        size: JOURNAL_DETAILS_DIALOG_SIZE,
        data,
      })
      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) {
            return EMPTY;
          }

          this.isDeleting.set(true);

          return this.journalService.deleteEntry(currentEntry.id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isDeleting.set(false);

          this.notifications.open(JOURNAL_MESSAGES.deleteSuccess).subscribe();

          void this.router.navigate(['/journal']);
        },
        error: () => {
          this.isDeleting.set(false);

          this.notifications.open(JOURNAL_MESSAGES.deleteFailed).subscribe();
        },
      });
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
