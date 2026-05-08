export const EMOTION_STATE_ORDER = [
  'joy',
  'calm',
  'neutral',
  'anxiety',
  'sadness',
  'anger',
] as const;

export type EmotionState = (typeof EMOTION_STATE_ORDER)[number];

export const EMOTION_STATES: Record<
  EmotionState,
  {
    label: string;
    emoji: string;
  }
> = {
  joy: {
    label: 'Радость',
    emoji: '😊',
  },

  calm: {
    label: 'Спокойствие',
    emoji: '😌',
  },

  neutral: {
    label: 'Нейтрально',
    emoji: '😐',
  },

  anxiety: {
    label: 'Тревога',
    emoji: '😟',
  },

  sadness: {
    label: 'Грусть',
    emoji: '😔',
  },

  anger: {
    label: 'Злость',
    emoji: '😠',
  },
};

export const UNKNOWN_EMOTION_LABEL = 'Неизвестно';

export const UNKNOWN_EMOTION_EMOJI = '📝';
