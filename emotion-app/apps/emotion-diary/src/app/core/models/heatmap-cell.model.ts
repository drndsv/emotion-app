import { EmotionState } from '@emotion-app/shared';

import { DayPeriod } from './day-period.model';
import { JournalEntry } from './journal-entry.model';

export interface HeatmapCell {
  day: number;
  period: DayPeriod;
  state: EmotionState | null;
  entry: JournalEntry | null;
  count: number;
}
