import { Timestamp } from 'firebase/firestore';

import { DayPeriodOption } from '../models/day-period.model';
import { JournalEntry } from '../models/journal-entry.model';

import { buildHeatmapCells } from './heatmap.util';

const periods: readonly DayPeriodOption[] = [
  {
    value: 'morning',
    label: 'Утро',
    from: 6,
    to: 12,
  },
  {
    value: 'day',
    label: 'День',
    from: 12,
    to: 18,
  },
];

function createEntry(
  id: string,
  date: Date,
  state: JournalEntry['finalState'],
): JournalEntry {
  return {
    id,
    userId: 'user-id',
    text: `Entry ${id}`,
    selectedState: state,
    detectedState: state,
    finalState: state,
    analysis: '',
    recommendation: '',
    createdAt: Timestamp.fromDate(date),
    updatedAt: Timestamp.fromDate(date),
  };
}

describe('buildHeatmapCells', () => {
  it('should build cells for every day and period', () => {
    const cells = buildHeatmapCells({
      entries: [],
      days: [1, 2],
      periods,
      selectedMonth: new Date(2026, 4, 1),
    });

    expect(cells).toHaveLength(4);
  });

  it('should set empty cell when there are no entries', () => {
    const [cell] = buildHeatmapCells({
      entries: [],
      days: [1],
      periods: [periods[0]],
      selectedMonth: new Date(2026, 4, 1),
    });

    expect(cell).toEqual({
      day: 1,
      period: 'morning',
      state: null,
      entry: null,
      count: 0,
    });
  });

  it('should use latest entry for selected day and period', () => {
    const firstEntry = createEntry('1', new Date(2026, 4, 1, 9, 0), 'calm');
    const latestEntry = createEntry('2', new Date(2026, 4, 1, 10, 0), 'joy');

    const [cell] = buildHeatmapCells({
      entries: [latestEntry, firstEntry],
      days: [1],
      periods: [periods[0]],
      selectedMonth: new Date(2026, 4, 1),
    });

    expect(cell.state).toBe('joy');
    expect(cell.entry).toBe(latestEntry);
    expect(cell.count).toBe(2);
  });

  it('should ignore entries from another month', () => {
    const entry = createEntry('1', new Date(2026, 5, 1, 9, 0), 'joy');

    const [cell] = buildHeatmapCells({
      entries: [entry],
      days: [1],
      periods: [periods[0]],
      selectedMonth: new Date(2026, 4, 1),
    });

    expect(cell.state).toBeNull();
    expect(cell.entry).toBeNull();
    expect(cell.count).toBe(0);
  });
});
