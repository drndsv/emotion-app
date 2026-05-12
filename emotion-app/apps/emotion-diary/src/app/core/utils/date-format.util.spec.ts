import { Timestamp } from 'firebase/firestore';

import { formatJournalDate, formatJournalTime } from './date-format.util';

describe('date-format.util', () => {
  const timestamp = Timestamp.fromDate(new Date(2026, 4, 12, 14, 35));

  it('should format journal date', () => {
    expect(formatJournalDate(timestamp)).toBe('12 мая 2026 г.');
  });

  it('should format journal time', () => {
    expect(formatJournalTime(timestamp)).toBe('14:35');
  });
});
