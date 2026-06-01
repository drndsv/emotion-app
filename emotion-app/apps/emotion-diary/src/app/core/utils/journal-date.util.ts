import { JournalDateValue } from '../models/journal-entry.model';

export function journalDateToDate(value: JournalDateValue): Date {
  if (typeof value === 'string') {
    return new Date(value);
  }

  if (value instanceof Date) {
    return value;
  }
  return value.toDate();
}

export function journalDateToMillis(value: JournalDateValue): number {
  return journalDateToDate(value).getTime();
}
