import { JournalEntry } from './journal-entry.model';

export interface JournalEntriesGroup {
  date: string;
  entries: readonly JournalEntry[];
}
