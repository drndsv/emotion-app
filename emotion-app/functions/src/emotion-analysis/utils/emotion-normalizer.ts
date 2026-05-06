import { EMOTION_STATES } from '../constants/emotion-states';
import { EmotionState } from '../models/emotion-analysis-result.model';

export function isEmotionState(value: string): value is EmotionState {
  return EMOTION_STATES.includes(value as EmotionState);
}

export function normalizeEmotion(emotion: string): EmotionState {
  const normalized = emotion.toLowerCase();

  if (
    normalized.includes('joy') ||
    normalized.includes('рад') ||
    normalized.includes('счаст') ||
    normalized.includes('позитив') ||
    normalized.includes('удоволь')
  ) {
    return 'joy';
  }

  if (
    normalized.includes('calm') ||
    normalized.includes('спокой') ||
    normalized.includes('расслаб') ||
    normalized.includes('устойчив')
  ) {
    return 'calm';
  }

  if (
    normalized.includes('anxiety') ||
    normalized.includes('трев') ||
    normalized.includes('страх') ||
    normalized.includes('беспок') ||
    normalized.includes('нерв') ||
    normalized.includes('напряж')
  ) {
    return 'anxiety';
  }

  if (
    normalized.includes('sadness') ||
    normalized.includes('sad') ||
    normalized.includes('груст') ||
    normalized.includes('печал') ||
    normalized.includes('устал') ||
    normalized.includes('подав')
  ) {
    return 'sadness';
  }

  return 'neutral';
}
