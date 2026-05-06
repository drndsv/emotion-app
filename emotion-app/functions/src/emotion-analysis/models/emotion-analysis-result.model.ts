export type EmotionState = 'joy' | 'calm' | 'neutral' | 'anxiety' | 'sadness';

export interface EmotionAnalysisResult {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
}

export interface GigaChatEmotionJson {
  emotion?: string;
  analysis?: string;
  recommendation?: string;
}
