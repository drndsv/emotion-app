export const EMOTION_STATES = [
  'joy',
  'calm',
  'neutral',
  'anxiety',
  'sadness',
] as const;

export type EmotionState = (typeof EMOTION_STATES)[number];

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
