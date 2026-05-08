import { EmotionState } from '@emotion-app/shared';

export interface EmotionAnalysisResult {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
}

export interface AnalyzeEmotionRequest {
  text: string;
}
