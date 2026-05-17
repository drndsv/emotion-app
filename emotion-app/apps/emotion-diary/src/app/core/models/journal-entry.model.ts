import { EmotionState } from '@emotion-app/shared';

export type JournalDateValue = Date | string | { toDate: () => Date };

export interface JournalEntry {
  id: string;
  userId: string;
  text: string;
  selectedState: EmotionState;
  detectedState: EmotionState;
  finalState: EmotionState;
  analysis: string;
  recommendation: string;
  createdAt: JournalDateValue;
  updatedAt: JournalDateValue;
}

export type CreateJournalEntry = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateJournalEntry = Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>;
