import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton, TuiInput } from '@taiga-ui/core';
import {
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiTextarea,
} from '@taiga-ui/kit';

interface AnalysisResult {
  detectedState: string;
  analysis: string;
  recommendation: string;
}

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
  ],
  templateUrl: './journal-form-page.component.html',
  styleUrl: './journal-form-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalFormPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly entryId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = this.entryId !== null;

  protected readonly states: readonly string[] = [
    'Спокойствие',
    'Радость',
    'Грусть',
    'Тревога',
    'Нейтрально',
  ];

  protected readonly selectedStateControl = new FormControl(
    this.isEditMode ? 'Спокойствие' : '',
    { nonNullable: true },
  );

  protected readonly textControl = new FormControl(
    this.isEditMode ? 'Сегодня я чувствую усталость и тревогу...' : '',
    { nonNullable: true },
  );

  protected readonly finalStateControl = new FormControl('', {
    nonNullable: true,
  });

  protected analysisResult: AnalysisResult | null = null;

  protected runAnalysis(): void {
    this.analysisResult = {
      detectedState: 'Грусть',
      analysis: 'Текст выражает эмоциональную усталость и лёгкую грусть.',
      recommendation:
        'Небольшая прогулка или короткий отдых могут помочь снизить напряжение.',
    };

    this.finalStateControl.setValue('Грусть');
  }
}
