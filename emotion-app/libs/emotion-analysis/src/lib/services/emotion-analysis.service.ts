import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { EmotionState } from '../../../../../apps/emotion-diary/src/app/core/constants/emotion-states';
import { EmotionAnalysisRequest } from '../models/emotion-analysis-request.model';
import { EmotionAnalysisResult } from '../models/emotion-analysis-result.model';

@Injectable({
  providedIn: 'root',
})
export class EmotionAnalysisService {
  private readonly useMock = true;

  analyze(text: string): Observable<EmotionAnalysisResult> {
    const request: EmotionAnalysisRequest = {
      text: text.trim(),
    };

    if (this.useMock) {
      return this.analyzeMock(request);
    }

    return this.analyzeHttp(request);
  }

  private analyzeMock(
    request: EmotionAnalysisRequest,
  ): Observable<EmotionAnalysisResult> {
    const detectedState = this.detectMockEmotion(request.text);

    return of({
      detectedState,
      analysis: this.getMockAnalysis(detectedState),
      recommendation: this.getMockRecommendation(detectedState),
    }).pipe(delay(800));
  }

  private analyzeHttp(
    request: EmotionAnalysisRequest,
  ): Observable<EmotionAnalysisResult> {
    // TODO: заменить mock на HTTP-запрос к backend:
    // return this.httpClient.post<EmotionAnalysisResult>(
    //   `${environment.apiUrl}/analyze-emotion`,
    //   request,
    // );

    return this.analyzeMock(request);
  }

  private detectMockEmotion(text: string): EmotionState {
    const normalizedText = text.toLowerCase();

    if (
      normalizedText.includes('трев') ||
      normalizedText.includes('переж') ||
      normalizedText.includes('нерв')
    ) {
      return 'anxiety';
    }

    if (
      normalizedText.includes('рад') ||
      normalizedText.includes('счаст') ||
      normalizedText.includes('хорош')
    ) {
      return 'joy';
    }

    if (
      normalizedText.includes('груст') ||
      normalizedText.includes('печал') ||
      normalizedText.includes('плох')
    ) {
      return 'sadness';
    }

    if (normalizedText.includes('спокой') || normalizedText.includes('отдох')) {
      return 'calm';
    }

    return 'neutral';
  }

  private getMockAnalysis(state: EmotionState): string {
    const analyses: Record<EmotionState, string> = {
      joy: 'В тексте заметны положительные эмоции, ощущение радости и удовлетворения.',
      calm: 'Текст отражает спокойное и устойчивое эмоциональное состояние.',
      neutral: 'Текст не содержит ярко выраженной эмоциональной окраски.',
      anxiety:
        'В тексте заметны признаки тревоги, напряжения или внутреннего беспокойства.',
      sadness:
        'Текст отражает грусть, усталость или сниженное эмоциональное состояние.',
    };

    return analyses[state];
  }

  private getMockRecommendation(state: EmotionState): string {
    const recommendations: Record<EmotionState, string> = {
      joy: 'Постарайтесь сохранить это состояние: отметьте, что именно помогло вам почувствовать себя лучше.',
      calm: 'Хороший момент для восстановления: можно немного отдохнуть или заняться приятным делом.',
      neutral:
        'Попробуйте прислушаться к себе и отметить, что могло повлиять на ваше состояние сегодня.',
      anxiety:
        'Попробуйте сделать паузу, глубоко подышать или выписать мысли, которые вызывают напряжение.',
      sadness:
        'Позвольте себе немного отдыха. Может помочь прогулка, разговор с близким человеком или спокойное занятие.',
    };

    return recommendations[state];
  }
}
