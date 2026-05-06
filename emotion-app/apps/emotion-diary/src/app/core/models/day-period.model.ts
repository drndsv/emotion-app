export type DayPeriod = 'night' | 'morning' | 'day' | 'evening';

export interface DayPeriodOption {
  value: DayPeriod;
  label: string;
  from: number;
  to: number;
}
