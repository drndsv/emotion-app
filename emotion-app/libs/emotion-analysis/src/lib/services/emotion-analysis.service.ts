import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';
import { EMOTION_API_URL } from '../tokens/api-url.token';

type BackendEmotionAnalysisResult = {
  detectedEmotion: string;
  analysis: string;
  recommendation: string;
};

@Injectable({ providedIn: 'root' })
export class EmotionAnalysisService {
  constructor(
    private readonly http: HttpClient,
    @Inject(EMOTION_API_URL) private readonly apiUrl: string,
  ) {}

  analyze(text: string): Observable<EmotionAnalysisResult> {
    return this.http
      .post<BackendEmotionAnalysisResult>(`${this.apiUrl}/emotion/analyze`, { text })
      .pipe(
        map((result) => ({
          detectedState: (result.detectedEmotion ?? 'neutral') as EmotionAnalysisResult['detectedState'],
          analysis: result.analysis ?? '',
          recommendation: result.recommendation ?? '',
        })),
      );
  }
}
