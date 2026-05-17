import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';

@Injectable({ providedIn: 'root' })
export class EmotionAnalysisService {
  private readonly apiUrl = 'http://localhost:8080/api';
  constructor(private readonly http: HttpClient) {}
  analyze(text: string): Observable<EmotionAnalysisResult> {
    return this.http.post<EmotionAnalysisResult>(`${this.apiUrl}/emotion/analyze`, { text });
  }
}
