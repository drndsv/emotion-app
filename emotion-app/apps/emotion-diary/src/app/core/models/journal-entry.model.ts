import { Timestamp } from 'firebase/firestore';

export interface JournalEntry {
  id: string;
  userId: string;
  text: string;
  selectedState: string;
  detectedState: string;
  finalState: string;
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
