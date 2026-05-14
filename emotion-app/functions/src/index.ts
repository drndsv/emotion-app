import { setGlobalOptions } from 'firebase-functions';
import { onCall } from 'firebase-functions/v2/https';

import { FALLBACK_ANALYSIS_RESULT } from './emotion-analysis/constants/emotion-states';
import { analyzeEmotionWithGigaChat } from './emotion-analysis/services/gigachat.service';
import {
  ANALYSIS_MESSAGES,
  ANALYSIS_TEXT_MIN_LENGTH,
  FUNCTIONS_ALLOWED_ORIGINS,
  FUNCTIONS_MAX_INSTANCES,
  FUNCTIONS_REGION,
} from './emotion-analysis/constants/function-options';

setGlobalOptions({
  region: FUNCTIONS_REGION,
  maxInstances: FUNCTIONS_MAX_INSTANCES,
});

export const analyzeEmotion = onCall(
  { cors: FUNCTIONS_ALLOWED_ORIGINS },
  async (request) => {
    const text = String(request.data.text ?? '').trim();

    if (text.length < ANALYSIS_TEXT_MIN_LENGTH) {
      throw new Error(ANALYSIS_MESSAGES.textTooShort);
    }

    try {
      return await analyzeEmotionWithGigaChat(text);
    } catch (error) {
      console.error(error);

      return FALLBACK_ANALYSIS_RESULT;
    }
  },
);
