import { Injectable } from '@angular/core';
import { getFunctionsInstance } from '@emotion-app/firebase';
import { httpsCallable } from 'firebase/functions';
import { from, map, Observable } from 'rxjs';

import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';

@Injectable({
  providedIn: 'root',
})
export class EmotionAnalysisService {
  private readonly functions = getFunctionsInstance();

  analyze(text: string): Observable<EmotionAnalysisResult> {
    const analyzeEmotion = httpsCallable<
      { text: string },
      EmotionAnalysisResult
    >(this.functions, 'analyzeEmotion');

    return from(analyzeEmotion({ text })).pipe(map((result) => result.data));
  }
}
