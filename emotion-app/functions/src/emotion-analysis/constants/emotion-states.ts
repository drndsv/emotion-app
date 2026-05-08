import {
  EMOTION_STATES,
  EmotionState,
} from '../models/emotion-analysis-result.model';

export { EMOTION_STATES };

export const DEFAULT_ANALYSIS =
  'Эмоциональное состояние было определено автоматически.';

export const DEFAULT_RECOMMENDATION =
  'Попробуйте прислушаться к себе и немного отдохнуть.';

export const FALLBACK_ANALYSIS_RESULT = {
  detectedState: 'neutral',
  analysis: 'Не удалось выполнить анализ эмоций.',
  recommendation: 'Попробуйте повторить запрос позже.',
} satisfies {
  detectedState: EmotionState;
  analysis: string;
  recommendation: string;
};
