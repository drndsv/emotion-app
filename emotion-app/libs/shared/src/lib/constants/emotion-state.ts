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
