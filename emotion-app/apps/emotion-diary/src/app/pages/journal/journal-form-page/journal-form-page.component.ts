import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmotionAnalysisService } from '@emotion-app/emotion-analysis';
import { EmotionState } from '@emotion-app/shared';
import { TuiButton, TuiHint, TuiInput, TuiLoader } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiTextarea,
} from '@taiga-ui/kit';
import { catchError, Observable, of } from 'rxjs';

import {
  EMOTION_STATE_LABELS,
  getEmotionLabel,
  getEmotionStateByLabel,
} from '../../../core/constants/emotion-states';
import {
  JOURNAL_ENTRY_ID_PARAM,
  JOURNAL_FALLBACK_DETECTED_STATE,
  JOURNAL_FORM_MESSAGES,
  JOURNAL_TEXT_MAX_LENGTH,
  JOURNAL_TEXT_MIN_LENGTH,
} from '../../../core/constants/journal-form';
import { LOGGER_EVENTS } from '../../../core/constants/logger';
import { AnalysisResult } from '../../../core/models/analysis-result.model';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';
import { LoggerService } from '../../../core/services/logger.service';
import {
  formatJournalDate,
  formatJournalTime,
} from '../../../core/utils/date-format.util';

@Component({
  selector: 'app-journal-form-page',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiInput,
    TuiChevron,
    TuiDataListWrapper,
    TuiSelect,
    TuiTextarea,
    RouterLink,
    TuiLoader,
    TuiHint,
  ],
  templateUrl: './journal-form-page.component.html',
  styleUrl: './journal-form-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly journalService = inject(JournalService);
  private readonly authService = inject(AuthService);
  private readonly emotionAnalysisService = inject(EmotionAnalysisService);
  private readonly loggerService = inject(LoggerService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly entryId = this.route.snapshot.paramMap.get(
    JOURNAL_ENTRY_ID_PARAM,
  );

  protected readonly isEditMode = this.entryId !== null;

  protected readonly textMinLength = JOURNAL_TEXT_MIN_LENGTH;
  protected readonly textMaxLength = JOURNAL_TEXT_MAX_LENGTH;

  protected readonly states = EMOTION_STATE_LABELS;

  protected readonly entry = signal<JournalEntry | null>(null);

  protected readonly selectedStateControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly finalStateControl = new FormControl('', {
    nonNullable: true,
  });

  protected readonly textControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(JOURNAL_TEXT_MIN_LENGTH),
    ],
  });

  protected readonly analysisResult = signal<AnalysisResult | null>(null);

  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly isAnalyzing = signal(false);

  protected readonly errorMessage = signal('');
  protected readonly analysisErrorMessage = signal('');

  ngOnInit(): void {
    this.loadEntryForEdit();
  }

  protected runAnalysis(): void {
    if (this.textControl.invalid) {
      this.textControl.markAsTouched();
      this.analysisErrorMessage.set(JOURNAL_FORM_MESSAGES.textTooShort);

      return;
    }

    this.isAnalyzing.set(true);
    this.errorMessage.set('');
    this.analysisErrorMessage.set('');

    this.loggerService
      .logEvent(LOGGER_EVENTS.aiAnalysisStarted)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.emotionAnalysisService
      .analyze(this.textControl.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.isAnalyzing.set(false);

          this.analysisResult.set(result);

          this.finalStateControl.setValue(
            getEmotionLabel(result.detectedState),
          );

          this.loggerService
            .logEvent(LOGGER_EVENTS.aiAnalysisSuccess, {
              detectedState: result.detectedState,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
        error: (error: unknown) => {
          this.isAnalyzing.set(false);

          this.analysisErrorMessage.set(JOURNAL_FORM_MESSAGES.analysisFailed);

          this.loggerService
            .logError(LOGGER_EVENTS.aiAnalysisFailed, error)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  protected save(): void {
    const selectedState = getEmotionStateByLabel(
      this.selectedStateControl.value,
    );

    const finalState = getEmotionStateByLabel(this.finalStateControl.value);

    if (this.textControl.invalid || selectedState === null) {
      this.errorMessage.set(JOURNAL_FORM_MESSAGES.requiredFields);

      return;
    }

    const user = this.authService.currentUser;

    if (!user) {
      this.errorMessage.set(JOURNAL_FORM_MESSAGES.notAuthorized);

      return;
    }

    const request$ = this.createSaveRequest({
      userId: user.uid,
      text: this.textControl.value,
      selectedState,
      finalState,
    });

    if (request$ === null) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSaving.set(false);

        this.loggerService
          .logEvent(
            this.isEditMode
              ? LOGGER_EVENTS.journalEntryUpdated
              : LOGGER_EVENTS.journalEntryCreated,
          )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            void this.router.navigate(['/journal']);
          });
      },
      error: (error: unknown) => {
        this.isSaving.set(false);

        this.errorMessage.set(JOURNAL_FORM_MESSAGES.saveFailed);

        this.loggerService
          .logError(
            this.isEditMode
              ? LOGGER_EVENTS.journalEntryUpdateFailed
              : LOGGER_EVENTS.journalEntryCreateFailed,
            error,
          )
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
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

  private loadEntryForEdit(): void {
    if (this.entryId === null) {
      return;
    }

    this.isLoading.set(true);

    this.journalService
      .getEntryById(this.entryId)
      .pipe(
        catchError((error: unknown) => {
          this.errorMessage.set(JOURNAL_FORM_MESSAGES.loadFailed);

          this.loggerService
            .logError(LOGGER_EVENTS.journalEntryLoadFailed, error, {
              entryId: this.entryId,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((entry) => {
        this.isLoading.set(false);

        if (!entry) {
          return;
        }

        this.entry.set(entry);

        this.selectedStateControl.setValue(
          getEmotionLabel(entry.selectedState),
        );

        this.textControl.setValue(entry.text);

        this.finalStateControl.setValue(getEmotionLabel(entry.finalState));

        if (entry.detectedState && entry.analysis && entry.recommendation) {
          this.analysisResult.set({
            detectedState: entry.detectedState,
            analysis: entry.analysis,
            recommendation: entry.recommendation,
          });
        }
      });
  }

  private createSaveRequest(params: {
    userId: string;
    text: string;
    selectedState: EmotionState;
    finalState: EmotionState | null;
  }): Observable<unknown> | null {
    const analysisResult = this.analysisResult();

    const payload = {
      userId: params.userId,
      text: params.text,
      selectedState: params.selectedState,
      detectedState:
        analysisResult?.detectedState ?? JOURNAL_FALLBACK_DETECTED_STATE,
      finalState:
        params.finalState ??
        analysisResult?.detectedState ??
        params.selectedState,
      analysis: analysisResult?.analysis ?? '',
      recommendation: analysisResult?.recommendation ?? '',
    };

    if (this.entryId !== null) {
      return this.journalService.updateEntry(this.entryId, payload);
    }

    return this.journalService.createEntry(payload);
  }
}
