jest.mock('../../../core/services/auth.service', () => ({
  AuthService: class AuthService {},
}));

jest.mock('../../../core/services/journal.service', () => ({
  JournalService: class JournalService {},
}));

import { TestBed } from '@angular/core/testing';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject, of, throwError } from 'rxjs';

import {
  getEmotionEmoji,
  getEmotionLabel,
} from '../../../core/constants/emotion-states';
import {
  JOURNAL_INITIAL_PAGE,
  JOURNAL_MESSAGES,
  JOURNAL_MIN_PAGES_FOR_PAGINATION,
  JOURNAL_PAGE_SIZE,
} from '../../../core/constants/journal';
import { JournalEntry } from '../../../core/models/journal-entry.model';
import { AuthService } from '../../../core/services/auth.service';
import { JournalService } from '../../../core/services/journal.service';

import { JournalPageComponent } from './journal-page.component';

function createEntry(
  id: string,
  date: Date,
  text = `Текст записи ${id}`,
): JournalEntry {
  const timestamp = Timestamp.fromDate(date);

  return {
    id,
    userId: 'user-id',
    text,
    selectedState: 'joy',
    detectedState: 'joy',
    finalState: 'joy',
    analysis: '',
    recommendation: '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createEntries(count: number): readonly JournalEntry[] {
  return Array.from({ length: count }, (_, index) =>
    createEntry(
      String(index + 1),
      new Date(2026, 4, 12, 10, index),
      `Запись ${index + 1}`,
    ),
  );
}

function setup(
  params: {
    user?: { uid: string } | null | undefined;
    entries?: readonly JournalEntry[];
    loadError?: boolean;
  } = {},
) {
  const user = Object.prototype.hasOwnProperty.call(params, 'user')
    ? params.user
    : { uid: 'user-id' };

  const entries = params.entries ?? createEntries(3);

  const currentUser$ = new BehaviorSubject<{ uid: string } | null | undefined>(
    user,
  );

  const authService = {
    currentUser$,
  };

  const journalService = {
    getUserEntries: jest.fn(() =>
      params.loadError ? throwError(() => new Error()) : of(entries),
    ),
  };

  TestBed.resetTestingModule();

  TestBed.configureTestingModule({
    providers: [
      {
        provide: AuthService,
        useValue: authService,
      },
      {
        provide: JournalService,
        useValue: journalService,
      },
    ],
  });

  const component = TestBed.runInInjectionContext(
    () => new JournalPageComponent(),
  );

  return {
    component: component as unknown as {
      pageSize: number;
      currentPage: {
        (): number;
        set: (value: number) => void;
      };
      minPagesForPagination: number;
      searchControl: {
        value: string;
        setValue: (value: string) => void;
      };
      entries: () => readonly JournalEntry[];
      isLoading: () => boolean;
      errorMessage: () => string;
      filteredEntries: () => readonly JournalEntry[];
      totalPages: () => number;
      paginatedEntries: () => readonly JournalEntry[];
      groupedEntries: () => readonly {
        date: string;
        entries: readonly JournalEntry[];
      }[];
      getStateEmoji: (state: JournalEntry['finalState']) => string;
      getStateLabel: (state: JournalEntry['finalState']) => string;
      formatDate: (entry: JournalEntry) => string;
      formatTime: (entry: JournalEntry) => string;
    },
    authService,
    journalService,
    currentUser$,
    entries,
  };
}

describe('JournalPageComponent', () => {
  describe('initial state', () => {
    it('should use configured page size', () => {
      const { component } = setup();

      expect(component.pageSize).toBe(JOURNAL_PAGE_SIZE);
    });

    it('should use initial page from constants', () => {
      const { component } = setup();

      expect(component.currentPage()).toBe(JOURNAL_INITIAL_PAGE);
    });

    it('should use min pages for pagination from constants', () => {
      const { component } = setup();

      expect(component.minPagesForPagination).toBe(
        JOURNAL_MIN_PAGES_FOR_PAGINATION,
      );
    });
  });

  describe('entries loading', () => {
    it('should request entries for current user', () => {
      const { journalService } = setup();

      expect(journalService.getUserEntries).toHaveBeenCalledWith('user-id');
    });

    it('should store loaded entries', () => {
      const { component, entries } = setup();

      expect(component.entries()).toEqual(entries);
    });

    it('should stop loading after successful load', () => {
      const { component } = setup();

      expect(component.isLoading()).toBe(false);
    });

    it('should ignore undefined user', () => {
      const { journalService } = setup({
        user: undefined,
      });

      expect(journalService.getUserEntries).not.toHaveBeenCalled();
    });

    it('should ignore null user', () => {
      const { journalService } = setup({
        user: null,
      });

      expect(journalService.getUserEntries).not.toHaveBeenCalled();
    });

    it('should set error message when entries loading fails', () => {
      const { component } = setup({
        loadError: true,
      });

      expect(component.errorMessage()).toBe(JOURNAL_MESSAGES.loadFailed);
    });

    it('should use empty entries when entries loading fails', () => {
      const { component } = setup({
        loadError: true,
      });

      expect(component.entries()).toEqual([]);
    });

    it('should stop loading when entries loading fails', () => {
      const { component } = setup({
        loadError: true,
      });

      expect(component.isLoading()).toBe(false);
    });
  });

  describe('search', () => {
    it('should return all entries for empty search query', () => {
      const { component, entries } = setup();

      expect(component.filteredEntries()).toEqual(entries);
    });

    it('should filter entries by text', () => {
      const targetEntry = createEntry(
        '1',
        new Date(2026, 4, 12, 10, 0),
        'Очень спокойный день',
      );

      const { component } = setup({
        entries: [
          targetEntry,
          createEntry('2', new Date(2026, 4, 12, 11, 0), 'Обычная запись'),
        ],
      });

      component.searchControl.setValue('спокойный');

      expect(component.filteredEntries()).toEqual([targetEntry]);
    });

    it('should filter entries by formatted date', () => {
      const entries = [
        createEntry('1', new Date(2026, 4, 12, 10, 0)),
        createEntry('2', new Date(2026, 4, 12, 11, 0)),
      ];

      const { component } = setup({ entries });

      component.searchControl.setValue('12 мая');

      expect(component.filteredEntries()).toEqual(entries);
    });

    it('should return empty array when search has no matches', () => {
      const { component } = setup();

      component.searchControl.setValue('нет совпадений');

      expect(component.filteredEntries()).toEqual([]);
    });
  });

  describe('pagination', () => {
    it('should calculate total pages', () => {
      const { component } = setup({
        entries: createEntries(JOURNAL_PAGE_SIZE + 1),
      });

      expect(component.totalPages()).toBe(2);
    });

    it('should return first page entries by default', () => {
      const entries = createEntries(JOURNAL_PAGE_SIZE + 1);
      const { component } = setup({ entries });

      expect(component.paginatedEntries()).toEqual(
        entries.slice(0, JOURNAL_PAGE_SIZE),
      );
    });

    it('should return selected page entries', () => {
      const entries = createEntries(JOURNAL_PAGE_SIZE + 1);
      const { component } = setup({ entries });

      component.currentPage.set(1);

      expect(component.paginatedEntries()).toEqual(
        entries.slice(JOURNAL_PAGE_SIZE, JOURNAL_PAGE_SIZE * 2),
      );
    });

    it('should return empty page when current page is out of range', () => {
      const { component } = setup({
        entries: createEntries(JOURNAL_PAGE_SIZE),
      });

      component.currentPage.set(10);

      expect(component.paginatedEntries()).toEqual([]);
    });
  });

  describe('grouping', () => {
    it('should group paginated entries by date', () => {
      const { component } = setup({
        entries: [
          createEntry('1', new Date(2026, 4, 12, 10, 0)),
          createEntry('2', new Date(2026, 4, 12, 11, 0)),
        ],
      });

      expect(component.groupedEntries()[0]?.date).toBe('12 мая 2026 г.');
    });

    it('should include entries in date group', () => {
      const entries = [
        createEntry('1', new Date(2026, 4, 12, 10, 0)),
        createEntry('2', new Date(2026, 4, 12, 11, 0)),
      ];

      const { component } = setup({ entries });

      expect(component.groupedEntries()[0]?.entries).toEqual(entries);
    });

    it('should group only current page entries', () => {
      const entries = createEntries(JOURNAL_PAGE_SIZE + 1);
      const { component } = setup({ entries });

      component.currentPage.set(1);

      expect(component.groupedEntries()[0]?.entries).toEqual([
        entries[JOURNAL_PAGE_SIZE],
      ]);
    });
  });

  describe('helpers', () => {
    it('should return state emoji', () => {
      const { component } = setup();

      expect(component.getStateEmoji('joy')).toBe(getEmotionEmoji('joy'));
    });

    it('should return state label', () => {
      const { component } = setup();

      expect(component.getStateLabel('joy')).toBe(getEmotionLabel('joy'));
    });

    it('should format date', () => {
      const entry = createEntry('1', new Date(2026, 4, 12, 10, 0));
      const { component } = setup();

      expect(component.formatDate(entry)).toBe('12 мая 2026 г.');
    });

    it('should format time', () => {
      const entry = createEntry('1', new Date(2026, 4, 12, 10, 5));
      const { component } = setup();

      expect(component.formatTime(entry)).toBe('10:05');
    });
  });
});
