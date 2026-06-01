import { EmotionState } from '@emotion-app/shared';
import { TuiDay } from '@taiga-ui/cdk';

import { JournalEntry } from '../models/journal-entry.model';
import { journalDateToDate } from './journal-date.util';

export function filterJournalEntries(params: {
  entries: readonly JournalEntry[];
  query: string;
  formatDate: (entry: JournalEntry) => string;
  selectedState: EmotionState | null;
  selectedDate: TuiDay | null;
}): readonly JournalEntry[] {
  const normalizedQuery = params.query.trim().toLowerCase();

  return params.entries.filter((entry) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${entry.finalState} ${params.formatDate(entry)} ${entry.text}`
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesState =
      params.selectedState === null ||
      entry.finalState === params.selectedState;

    const matchesDate =
      params.selectedDate === null ||
      isSameDate(journalDateToDate(entry.createdAt), params.selectedDate);

    return matchesQuery && matchesState && matchesDate;
  });
}

function isSameDate(date: Date, selectedDate: TuiDay): boolean {
  return (
    date.getFullYear() === selectedDate.year &&
    date.getMonth() === selectedDate.month &&
    date.getDate() === selectedDate.day
  );
}
