import { EmotionState } from '@emotion-app/shared';
import { Timestamp } from 'firebase/firestore';

export interface JournalEntry {
  id: string;
  userId: string;
  text: string;
  selectedState: EmotionState;
  detectedState: EmotionState;
  finalState: EmotionState;
  analysis: string;
  recommendation: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateJournalEntry = Omit<
  JournalEntry,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateJournalEntry = Partial<
  Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>
>;
