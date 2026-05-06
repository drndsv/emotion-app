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

export interface EmotionStateOption {
  value: EmotionState;
  label: string;
}

export const EMOTION_STATE_OPTIONS: readonly EmotionStateOption[] = (
  Object.entries(EMOTION_STATES) as [
    EmotionState,
    (typeof EMOTION_STATES)[EmotionState],
  ][]
).map(([value, data]) => ({
  value,
  label: data.label,
}));

export const EMOTION_STATE_LABELS: readonly string[] =
  EMOTION_STATE_OPTIONS.map((option) => option.label);

export const EMOTION_STATE_ORDER: readonly EmotionState[] = [
  'joy',
  'calm',
  'neutral',
  'anxiety',
  'sadness',
];

export const getEmotionLabel = (state: EmotionState): string =>
  EMOTION_STATES[state]?.label ?? 'Неизвестно';

export const getEmotionEmoji = (state: EmotionState): string =>
  EMOTION_STATES[state]?.emoji ?? '📝';

export const getEmotionStateByLabel = (label: string): EmotionState | null =>
  EMOTION_STATE_OPTIONS.find((option) => option.label === label)?.value ?? null;
