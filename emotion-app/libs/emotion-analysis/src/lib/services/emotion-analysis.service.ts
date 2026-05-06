import { Injectable } from '@angular/core';
import { functions } from '@emotion-app/firebase';
import { httpsCallable } from 'firebase/functions';
import { from, map, Observable } from 'rxjs';

import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';

@Injectable({
  providedIn: 'root',
})
export class EmotionAnalysisService {
  analyze(text: string): Observable<EmotionAnalysisResult> {
    const analyzeEmotion = httpsCallable<
      { text: string },
      EmotionAnalysisResult
    >(functions, 'analyzeEmotion');

    return from(analyzeEmotion({ text })).pipe(map((result) => result.data));
  }
}
