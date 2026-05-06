import { onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions';

setGlobalOptions({
  region: 'europe-west1',
  maxInstances: 10,
});

export const analyzeEmotion = onCall((request) => {
  const text = String(request.data.text ?? '').toLowerCase();

  if (text.includes('трев') || text.includes('нерв')) {
    return {
      detectedState: 'anxiety',
      analysis: 'В тексте обнаружены признаки тревожности.',
      recommendation: 'Попробуйте немного отдохнуть и снизить нагрузку.',
    };
  }

  if (text.includes('рад') || text.includes('счаст')) {
    return {
      detectedState: 'joy',
      analysis: 'Текст содержит позитивные эмоции.',
      recommendation: 'Постарайтесь сохранить это состояние.',
    };
  }

  return {
    detectedState: 'neutral',
    analysis: 'Явных эмоциональных отклонений не обнаружено.',
    recommendation: 'Продолжайте наблюдать за своим состоянием.',
  };
});
