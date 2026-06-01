import { DayPeriodOption } from '../models/day-period.model';
import { HeatmapCell } from '../models/heatmap-cell.model';
import { JournalEntry } from '../models/journal-entry.model';
import { journalDateToDate, journalDateToMillis } from './journal-date.util';

export function buildHeatmapCells(params: {
  entries: readonly JournalEntry[];
  days: readonly number[];
  periods: readonly DayPeriodOption[];
  selectedMonth: Date;
}): readonly HeatmapCell[] {
  const year = params.selectedMonth.getFullYear();
  const month = params.selectedMonth.getMonth();

  return params.periods.flatMap((period) =>
    params.days.map((day) => {
      const entries = findEntriesByDayAndPeriod({
        entries: params.entries,
        year,
        month,
        day,
        period,
      });

      const latestEntry =
        entries.length > 0 ? entries[entries.length - 1] : null;

      return {
        day,
        period: period.value,
        state: latestEntry?.finalState ?? null,
        entry: latestEntry,
        count: entries.length,
      };
    }),
  );
}

function findEntriesByDayAndPeriod(params: {
  entries: readonly JournalEntry[];
  year: number;
  month: number;
  day: number;
  period: DayPeriodOption;
}): readonly JournalEntry[] {
  return params.entries
    .filter((entry) => {
      const entryDate = journalDateToDate(entry.createdAt);
      const hour = entryDate.getHours();

      return (
        entryDate.getFullYear() === params.year &&
        entryDate.getMonth() === params.month &&
        entryDate.getDate() === params.day &&
        hour >= params.period.from &&
        hour < params.period.to
      );
    })
    .sort(
      (first, second) => journalDateToMillis(first.createdAt) - journalDateToMillis(second.createdAt),
    );
}
