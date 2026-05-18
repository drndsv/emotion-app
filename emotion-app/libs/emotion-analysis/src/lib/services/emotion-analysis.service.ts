import { Injectable } from '@angular/core';
import { getFunctionsInstance } from '@emotion-app/firebase';
import { httpsCallable } from 'firebase/functions';
import { from, map, Observable } from 'rxjs';

import { ANALYZE_EMOTION_FUNCTION_NAME } from '../constants/emotion-analysis';
import {
  AnalyzeEmotionRequest,
  EmotionAnalysisResult,
} from '../models/emotion-analysis-result.model';

@Injectable({
  providedIn: 'root',
})
export class EmotionAnalysisService {
  private readonly functions = getFunctionsInstance();

  private readonly analyzeEmotionCallable = httpsCallable<
    AnalyzeEmotionRequest,
    EmotionAnalysisResult
  >(this.functions, ANALYZE_EMOTION_FUNCTION_NAME);

  analyze(text: string): Observable<EmotionAnalysisResult> {
    return from(
      this.analyzeEmotionCallable({
        text,
      }),
    ).pipe(map((result) => result.data));
  }
}
