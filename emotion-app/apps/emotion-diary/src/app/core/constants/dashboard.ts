export const DASHBOARD_DEFAULT_USER_NAME = 'Пользователь';

export const DASHBOARD_RECENT_ENTRIES_LIMIT = 6;

export const DASHBOARD_DATE_LOCALE = 'ru-RU';

export const DASHBOARD_MONTH_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'long',
  year: 'numeric',
};

export const DASHBOARD_ALL_STATES_LABEL = 'Все состояния';

export const DASHBOARD_EMPTY_CELL_LABEL = 'Нет записи';

export const DASHBOARD_NOT_AUTHORIZED_MESSAGE = 'Пользователь не авторизован';

export const DASHBOARD_LOAD_ERROR_MESSAGE = 'Ошибка загрузки данных';

export const createHeatmapCellLabel = (params: {
  day: number;
  stateLabel: string;
  count: number;
}): string => `${params.day}: ${params.stateLabel}, записей: ${params.count}`;
