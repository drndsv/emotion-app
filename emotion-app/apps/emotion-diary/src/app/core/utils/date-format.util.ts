import { Timestamp } from 'firebase/firestore';

export function formatJournalDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatJournalTime(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
