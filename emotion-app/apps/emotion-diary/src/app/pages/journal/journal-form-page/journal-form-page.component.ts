import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TuiButton, TuiInput, TuiLoader } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiTextarea,
} from '@taiga-ui/kit';
import { catchError, Observable, of } from 'rxjs';

import {
  EMOTION_STATE_LABELS,
  EmotionState,
  getEmotionLabel,
  getEmotionStateByLabel,
} from '../../../core/constants/emotion-states';
import { AnalysisResult } from '../../../core/models/analysis-result.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';

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
  ],
  templateUrl: './journal-form-page.component.html',
  styleUrl: './journal-form-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly journalService = inject(JournalService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly entryId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = this.entryId !== null;

  protected readonly states = EMOTION_STATE_LABELS;

  protected readonly selectedStateControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly finalStateControl = new FormControl('', {
    nonNullable: true,
  });

  protected readonly textControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  protected readonly analysisResult = signal<AnalysisResult | null>(null);

  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadEntryForEdit();
  }

  protected runAnalysis(): void {
    const result: AnalysisResult = {
      detectedState: 'sadness',
      analysis: 'Текст выражает усталость и лёгкую грусть.',
      recommendation: 'Попробуйте отдохнуть и переключиться.',
    };

    this.analysisResult.set(result);
    this.finalStateControl.setValue(getEmotionLabel(result.detectedState));
  }

  protected save(): void {
    const selectedState = getEmotionStateByLabel(
      this.selectedStateControl.value,
    );
    const finalState = getEmotionStateByLabel(this.finalStateControl.value);

    if (this.textControl.invalid || selectedState === null) {
      this.errorMessage.set('Заполните все обязательные поля');

      return;
    }

    const user = this.authService.currentUser;

    if (!user) {
      this.errorMessage.set('Пользователь не авторизован');

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
        void this.router.navigate(['/journal']);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('Ошибка сохранения');
      },
    });
  }

  protected getStateLabel(state: EmotionState): string {
    return getEmotionLabel(state);
  }

  private loadEntryForEdit(): void {
    if (this.entryId === null) {
      return;
    }

    this.isLoading.set(true);

    this.journalService
      .getEntryById(this.entryId)
      .pipe(
        catchError(() => {
          this.errorMessage.set('Ошибка загрузки записи');

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((entry) => {
        this.isLoading.set(false);

        if (!entry) {
          return;
        }

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
      detectedState: analysisResult?.detectedState ?? 'neutral',
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
