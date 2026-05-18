import {
  getDaysInMonth,
  getNextMonth,
  getPreviousMonth,
} from './dashboard-date.util';

describe('dashboard-date.util', () => {
  describe('getDaysInMonth', () => {
    it('should return all days for selected month', () => {
      expect(getDaysInMonth(new Date(2026, 4, 1))).toEqual(
        Array.from({ length: 31 }, (_, index) => index + 1),
      );
    });

    it('should handle february in leap year', () => {
      expect(getDaysInMonth(new Date(2024, 1, 1))).toHaveLength(29);
    });
  });

  describe('getPreviousMonth', () => {
    it('should return first day of previous month', () => {
      expect(getPreviousMonth(new Date(2026, 4, 15))).toEqual(
        new Date(2026, 3, 1),
      );
    });

    it('should handle previous year transition', () => {
      expect(getPreviousMonth(new Date(2026, 0, 15))).toEqual(
        new Date(2025, 11, 1),
      );
    });
  });

  describe('getNextMonth', () => {
    it('should return first day of next month', () => {
      expect(getNextMonth(new Date(2026, 4, 15))).toEqual(new Date(2026, 5, 1));
    });

    it('should handle next year transition', () => {
      expect(getNextMonth(new Date(2026, 11, 15))).toEqual(
        new Date(2027, 0, 1),
      );
    });
  });
});
