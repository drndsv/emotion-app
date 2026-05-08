export const JOURNAL_ENTRY_ID_PARAM = 'id';

export const JOURNAL_TEXT_MIN_LENGTH = 3;
export const JOURNAL_TEXT_MAX_LENGTH = 500;

export const JOURNAL_FALLBACK_DETECTED_STATE = 'neutral';

export const JOURNAL_FORM_MESSAGES = {
  textTooShort: 'Введите текст записи минимум из 3 символов',
  analysisFailed: 'Не удалось выполнить анализ. Попробуйте позже.',
  requiredFields: 'Заполните все обязательные поля',
  notAuthorized: 'Пользователь не авторизован',
  saveFailed: 'Ошибка сохранения',
  loadFailed: 'Ошибка загрузки записи',
} as const;
