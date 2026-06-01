import { JournalDateValue } from '../models/journal-entry.model';

function toDate(value: JournalDateValue): Date {
  if (typeof value === 'string') {
    return new Date(value);
  }

  if (value instanceof Date) {
    return value;
  }
  return value.toDate();
}

export function formatJournalDate(timestamp: JournalDateValue): string {
  return toDate(timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatJournalTime(timestamp: JournalDateValue): string {
  return toDate(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
