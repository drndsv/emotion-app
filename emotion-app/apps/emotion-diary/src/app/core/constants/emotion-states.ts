import {
  EMOTION_STATES,
  EMOTION_STATE_ORDER,
  EmotionState,
  UNKNOWN_EMOTION_EMOJI,
  UNKNOWN_EMOTION_LABEL,
} from '@emotion-app/shared';

export { EMOTION_STATE_ORDER };

export interface EmotionStateOption {
  value: EmotionState;
  label: string;
}

export const EMOTION_STATE_OPTIONS: readonly EmotionStateOption[] =
  EMOTION_STATE_ORDER.map((value) => ({
    value,
    label: EMOTION_STATES[value].label,
  }));

export const EMOTION_STATE_LABELS: readonly string[] =
  EMOTION_STATE_OPTIONS.map((option) => option.label);

export const getEmotionLabel = (state: EmotionState): string =>
  EMOTION_STATES[state]?.label ?? UNKNOWN_EMOTION_LABEL;

export const getEmotionEmoji = (state: EmotionState): string =>
  EMOTION_STATES[state]?.emoji ?? UNKNOWN_EMOTION_EMOJI;

export const getEmotionStateByLabel = (label: string): EmotionState | null =>
  EMOTION_STATE_OPTIONS.find((option) => option.label === label)?.value ?? null;
