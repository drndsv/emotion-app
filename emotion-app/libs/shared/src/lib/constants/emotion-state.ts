export const EMOTION_STATES = {
  calm: {
    label: 'Спокойствие',
    emoji: '😌',
  },
  joy: {
    label: 'Радость',
    emoji: '😊',
  },
  sadness: {
    label: 'Грусть',
    emoji: '😔',
  },
  anxiety: {
    label: 'Тревога',
    emoji: '😟',
  },
  neutral: {
    label: 'Нейтрально',
    emoji: '😐',
  },
} as const;

export type EmotionState = keyof typeof EMOTION_STATES;

export const EMOTION_STATE_ORDER: readonly EmotionState[] = [
  'joy',
  'calm',
  'neutral',
  'anxiety',
  'sadness',
];

export const UNKNOWN_EMOTION_LABEL = 'Неизвестно';

export const UNKNOWN_EMOTION_EMOJI = '📝';
