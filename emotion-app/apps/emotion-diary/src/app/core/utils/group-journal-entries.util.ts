import { JournalEntriesGroup } from '../models/journal-entries-group.model';
import { JournalEntry } from '../models/journal-entry.model';
import { journalDateToDate } from './journal-date.util';

export function groupJournalEntriesByDate(
  entries: readonly JournalEntry[],
): readonly JournalEntriesGroup[] {
  const groupsMap = new Map<string, JournalEntry[]>();

  entries.forEach((entry) => {
    const date = journalDateToDate(entry.createdAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const currentEntries = groupsMap.get(date) ?? [];

    currentEntries.push(entry);

    groupsMap.set(date, currentEntries);
  });

  return Array.from(groupsMap.entries()).map(([date, groupedEntries]) => ({
    date,
    entries: groupedEntries,
  }));
}
