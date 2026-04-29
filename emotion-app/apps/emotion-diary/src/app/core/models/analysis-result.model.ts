import { EmotionState } from '../constants/emotion-states';

export interface AnalysisResult {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
}
