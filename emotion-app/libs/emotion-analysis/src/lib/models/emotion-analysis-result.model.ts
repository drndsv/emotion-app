import { EmotionState } from '../../../../../apps/emotion-diary/src/app/core/constants/emotion-states';

export interface EmotionAnalysisResult {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
}
