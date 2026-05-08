import { DayPeriodOption } from '../models/day-period.model';

export const DAY_PERIODS: readonly DayPeriodOption[] = [
  { value: 'morning', label: 'Утро', from: 6, to: 12 },
  { value: 'day', label: 'День', from: 12, to: 18 },
  { value: 'evening', label: 'Вечер', from: 18, to: 24 },
  { value: 'night', label: 'Ночь', from: 0, to: 6 },
];
