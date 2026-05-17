import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../apps/emotion-diary/src/environments/environment';
import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';

type BackendEmotionAnalysisResult = {
  detectedEmotion: string;
  analysis: string;
  recommendation: string;
};

@Injectable({ providedIn: 'root' })
export class EmotionAnalysisService {
  constructor(private readonly http: HttpClient) {}

  analyze(text: string): Observable<EmotionAnalysisResult> {
    return this.http
      .post<BackendEmotionAnalysisResult>(`${environment.apiUrl}/emotion/analyze`, { text })
      .pipe(
        map((result) => ({
          detectedState: (result.detectedEmotion ?? 'neutral') as EmotionAnalysisResult['detectedState'],
          analysis: result.analysis ?? '',
          recommendation: result.recommendation ?? '',
        })),
      );
  }
}
