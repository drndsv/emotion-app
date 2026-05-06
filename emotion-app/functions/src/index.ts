import { setGlobalOptions } from 'firebase-functions';
import { onCall } from 'firebase-functions/v2/https';

import { FALLBACK_ANALYSIS_RESULT } from './emotion-analysis/constants/emotion-states';
import { analyzeEmotionWithGigaChat } from './emotion-analysis/services/gigachat.service';

setGlobalOptions({
  region: 'europe-west1',
  maxInstances: 10,
});

export const analyzeEmotion = onCall(async (request) => {
  const text = String(request.data.text ?? '').trim();

  if (text.length < 3) {
    throw new Error('Text is too short');
  }

  try {
    return await analyzeEmotionWithGigaChat(text);
  } catch (error) {
    console.error(error);

    return FALLBACK_ANALYSIS_RESULT;
  }
});
