import { EMOTION_STATE_ORDER, EmotionState } from '@emotion-app/shared';
import {
  DEFAULT_NORMALIZED_EMOTION,
  EMOTION_KEYWORDS,
} from '../constants/emotion-keywords';

export function isEmotionState(value: string): value is EmotionState {
  return EMOTION_STATE_ORDER.includes(value as EmotionState);
}

export function normalizeEmotion(emotion: string): EmotionState {
  const normalized = emotion.toLowerCase();

  for (const [state, keywords] of Object.entries(EMOTION_KEYWORDS) as [
    Exclude<EmotionState, 'neutral'>,
    readonly string[],
  ][]) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return state;
    }
  }

  return DEFAULT_NORMALIZED_EMOTION;
}
