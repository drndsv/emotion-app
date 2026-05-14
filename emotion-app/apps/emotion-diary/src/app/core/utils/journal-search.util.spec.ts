import { TuiDay } from '@taiga-ui/cdk';
import { Timestamp } from 'firebase/firestore';

import { JournalEntry } from '../models/journal-entry.model';

import { filterJournalEntries } from './journal-search.util';

function createEntry(
  params: Partial<JournalEntry> & { id: string; date?: Date },
): JournalEntry {
  const timestamp = Timestamp.fromDate(
    params.date ?? new Date(2026, 4, 12, 14, 30),
  );

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

  it('should return all entries when filters are empty', () => {
    expect(
      filterJournalEntries({
        entries,
        query: '',
        formatDate,
        selectedState: null,
        selectedDate: null,
      }),
    ).toEqual(entries);
  });

  it('should filter entries by text', () => {
    expect(
      filterJournalEntries({
        entries,
        query: 'тревожно',
        formatDate,
        selectedState: null,
        selectedDate: null,
      }),
    ).toEqual([entries[1]]);
  });

  it('should filter entries by final state in query', () => {
    expect(
      filterJournalEntries({
        entries,
        query: 'joy',
        formatDate,
        selectedState: null,
        selectedDate: null,
      }),
    ).toEqual([entries[0]]);
  });

  it('should filter entries by formatted date in query', () => {
    expect(
      filterJournalEntries({
        entries,
        query: '12 мая',
        formatDate,
        selectedState: null,
        selectedDate: null,
      }),
    ).toEqual(entries);
  });

  it('should be case insensitive and trim query', () => {
    expect(
      filterJournalEntries({
        entries,
        query: '  ХОРОШИЙ  ',
        formatDate,
        selectedState: null,
        selectedDate: null,
      }),
    ).toEqual([entries[0]]);
  });

  it('should filter entries by selected state', () => {
    expect(
      filterJournalEntries({
        entries,
        query: '',
        formatDate,
        selectedState: 'anxiety',
        selectedDate: null,
      }),
    ).toEqual([entries[1]]);
  });

  it('should filter entries by selected date', () => {
    const targetEntry = createEntry({
      id: '1',
      date: new Date(2026, 4, 12, 14, 30),
    });

    const otherEntry = createEntry({
      id: '2',
      date: new Date(2026, 4, 13, 14, 30),
    });

    expect(
      filterJournalEntries({
        entries: [targetEntry, otherEntry],
        query: '',
        formatDate,
        selectedState: null,
        selectedDate: new TuiDay(2026, 4, 12),
      }),
    ).toEqual([targetEntry]);
  });

  it('should apply query, state and date filters together', () => {
    const targetEntry = createEntry({
      id: '1',
      text: 'Хороший день',
      finalState: 'joy',
      date: new Date(2026, 4, 12, 14, 30),
    });

    const otherEntry = createEntry({
      id: '2',
      text: 'Хороший день',
      finalState: 'joy',
      date: new Date(2026, 4, 13, 14, 30),
    });

    expect(
      filterJournalEntries({
        entries: [targetEntry, otherEntry],
        query: 'хороший',
        formatDate,
        selectedState: 'joy',
        selectedDate: new TuiDay(2026, 4, 12),
      }),
    ).toEqual([targetEntry]);
  });
});
