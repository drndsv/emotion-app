import { Timestamp } from 'firebase/firestore';

import { JournalEntry } from '../models/journal-entry.model';

import { filterJournalEntries } from './journal-search.util';

function createEntry(
  params: Partial<JournalEntry> & { id: string },
): JournalEntry {
  const timestamp = Timestamp.fromDate(new Date(2026, 4, 12, 14, 30));

  return {
    id: params.id,
    userId: 'user-id',
    text: params.text ?? '',
    selectedState: params.selectedState ?? 'neutral',
    detectedState: params.detectedState ?? 'neutral',
    finalState: params.finalState ?? 'neutral',
    analysis: '',
    recommendation: '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

describe('filterJournalEntries', () => {
  const entries = [
    createEntry({
      id: '1',
      text: 'Сегодня был хороший день',
      finalState: 'joy',
    }),
    createEntry({
      id: '2',
      text: 'Было тревожно перед встречей',
      finalState: 'anxiety',
    }),
  ];

  const formatDate = jest.fn(() => '12 мая 2026 г.');

  it('should return all entries when query is empty', () => {
    expect(filterJournalEntries(entries, '', formatDate)).toBe(entries);
  });

  it('should filter entries by text', () => {
    expect(filterJournalEntries(entries, 'тревожно', formatDate)).toEqual([
      entries[1],
    ]);
  });

  it('should filter entries by final state', () => {
    expect(filterJournalEntries(entries, 'joy', formatDate)).toEqual([
      entries[0],
    ]);
  });

  it('should filter entries by formatted date', () => {
    expect(filterJournalEntries(entries, '12 мая', formatDate)).toEqual(
      entries,
    );
  });

  it('should be case insensitive and trim query', () => {
    expect(filterJournalEntries(entries, '  ХОРОШИЙ  ', formatDate)).toEqual([
      entries[0],
    ]);
  });
});
