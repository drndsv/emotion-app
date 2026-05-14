import { Timestamp } from 'firebase/firestore';

import { JournalEntry } from '../models/journal-entry.model';

import { groupJournalEntriesByDate } from './group-journal-entries.util';

function createEntry(id: string, date: Date): JournalEntry {
  return {
    id,
    userId: 'user-id',
    text: `Entry ${id}`,
    selectedState: 'joy',
    detectedState: 'joy',
    finalState: 'joy',
    analysis: '',
    recommendation: '',
    createdAt: Timestamp.fromDate(date),
    updatedAt: Timestamp.fromDate(date),
  };
}

describe('groupJournalEntriesByDate', () => {
  it('should group entries by created date', () => {
    const entries = [
      createEntry('1', new Date(2026, 4, 12, 10, 0)),
      createEntry('2', new Date(2026, 4, 12, 14, 0)),
      createEntry('3', new Date(2026, 4, 11, 9, 0)),
    ];

    expect(groupJournalEntriesByDate(entries)).toEqual([
      {
        date: '12 мая 2026 г.',
        entries: [entries[0], entries[1]],
      },
      {
        date: '11 мая 2026 г.',
        entries: [entries[2]],
      },
    ]);
  });

  it('should return empty array for empty entries list', () => {
    expect(groupJournalEntriesByDate([])).toEqual([]);
  });
});
