import { JournalEntry } from '../models/journal-entry.model';

export function filterJournalEntries(
  entries: readonly JournalEntry[],
  query: string,
  formatDate: (entry: JournalEntry) => string,
): readonly JournalEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) =>
    `${entry.finalState} ${formatDate(entry)} ${entry.text}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
