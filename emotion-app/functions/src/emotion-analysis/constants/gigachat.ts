export const GIGACHAT_AUTH_KEY = process.env.GIGACHAT_AUTH_KEY ?? '';
export const GIGACHAT_SCOPE = process.env.GIGACHAT_SCOPE ?? 'GIGACHAT_API_PERS';

export const GIGACHAT_OAUTH_URL =
  'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

export const GIGACHAT_COMPLETIONS_URL =
  'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

export const GIGACHAT_MODEL = 'GigaChat';
export const GIGACHAT_TEMPERATURE = 0.2;

export const GIGACHAT_SYSTEM_PROMPT =
  'Ты AI-помощник для анализа эмоционального состояния пользователя. Отвечай только валидным JSON.';

export const GIGACHAT_MESSAGES = {
  requestFailed: 'GigaChat request failed',
  tokenRequestFailed: 'Failed to get GigaChat access token',
} as const;

export const GIGACHAT_CONTENT_LOG_PREFIX = 'GigaChat content:';
