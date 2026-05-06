import { EmotionState } from '@emotion-app/shared';

export interface EmotionAnalysisResult {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
}
