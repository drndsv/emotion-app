import { Timestamp } from 'firebase/firestore';

export function formatJournalDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
