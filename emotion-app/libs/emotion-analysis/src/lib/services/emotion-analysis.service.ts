import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { EmotionState } from '../../../../../apps/emotion-diary/src/app/core/constants/emotion-states';
import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';

@Injectable({
  providedIn: 'root',
})
export class EmotionAnalysisService {
  analyze(text: string): Observable<EmotionAnalysisResult> {
    const normalizedText = text.trim().toLowerCase();

    let detectedState: EmotionState = 'calm';

    if (normalizedText.includes('трев')) {
      detectedState = 'anxiety';
    } else if (normalizedText.includes('рад')) {
      detectedState = 'joy';
    } else if (normalizedText.includes('груст')) {
      detectedState = 'sadness';
    }

    const result: EmotionAnalysisResult = {
      detectedState,
      analysis: 'Текст проанализирован. Обнаружено эмоциональное состояние.',
      recommendation: 'Попробуйте немного отдохнуть и прислушаться к себе.',
    };

    return of(result).pipe(delay(800));
  }
}
