import { EmotionState } from '@emotion-app/shared';

export const DEFAULT_NORMALIZED_EMOTION: EmotionState = 'neutral';

export const EMOTION_KEYWORDS: Record<
  Exclude<EmotionState, 'neutral'>,
  readonly string[]
> = {
  joy: ['joy', 'рад', 'счаст', 'позитив', 'удоволь'],
  calm: ['calm', 'спокой', 'расслаб', 'устойчив'],
  anxiety: ['anxiety', 'трев', 'страх', 'беспок', 'нерв', 'напряж'],
  sadness: ['sadness', 'sad', 'груст', 'печал', 'устал', 'подав'],
  anger: [
    'anger',
    'angry',
    'зл',
    'бесит',
    'раздраж',
    'агресс',
    'ярост',
    'ненав',
    'в бешенстве',
  ],
};
