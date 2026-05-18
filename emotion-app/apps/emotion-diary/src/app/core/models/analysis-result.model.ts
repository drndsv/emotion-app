import { EmotionState } from '@emotion-app/shared';

export interface AnalysisResult {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
}
