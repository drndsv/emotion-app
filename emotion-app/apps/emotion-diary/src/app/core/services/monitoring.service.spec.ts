jest.mock('@emotion-app/firebase', () => ({
  getFirestoreInstance: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => 'collection-ref'),
  getDocs: jest.fn(),
  limit: jest.fn((value: number) => ({ type: 'limit', value })),
  orderBy: jest.fn((field: string, direction: string) => ({
    type: 'orderBy',
    field,
    direction,
  })),
  query: jest.fn(() => 'logs-query'),
}));

import { TestBed } from '@angular/core/testing';
import { getDocs } from 'firebase/firestore';

import { MonitoringService } from './monitoring.service';

function createSnapshot(logs: readonly Record<string, unknown>[]): {
  docs: readonly { id: string; data: () => Record<string, unknown> }[];
} {
  return {
    docs: logs.map((log, index) => ({
      id: String(index + 1),
      data: () => log,
    })),
  };
}

function setup(logs: readonly Record<string, unknown>[] = []) {
  const getDocsMock = getDocs as jest.Mock;

  getDocsMock.mockResolvedValue(createSnapshot(logs));

  TestBed.resetTestingModule();

  const service = TestBed.inject(MonitoringService);

  return {
    service,
    getDocsMock,
  };
}

describe('MonitoringService', () => {
  it('should request logs from Firestore', (done) => {
    const { service, getDocsMock } = setup();

    service.getSummary().subscribe(() => {
      expect(getDocsMock).toHaveBeenCalledWith('logs-query');
      done();
    });
  });

  it('should count total logs', (done) => {
    const { service } = setup([
      { type: 'event', level: 'info', name: 'event_1' },
      { type: 'error', level: 'error', name: 'error_1' },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.totalLogs).toBe(2);
      done();
    });
  });

  it('should count event logs', (done) => {
    const { service } = setup([
      { type: 'event', level: 'info', name: 'event_1' },
      { type: 'event', level: 'info', name: 'event_2' },
      { type: 'error', level: 'error', name: 'error_1' },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.totalEvents).toBe(2);
      done();
    });
  });

  it('should count error logs', (done) => {
    const { service } = setup([
      { type: 'event', level: 'info', name: 'event_1' },
      { type: 'error', level: 'error', name: 'error_1' },
      { type: 'error', level: 'error', name: 'error_2' },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.totalErrors).toBe(2);
      done();
    });
  });

  it('should calculate popular events', (done) => {
    const { service } = setup([
      { type: 'event', level: 'info', name: 'ai_analysis_started' },
      { type: 'event', level: 'info', name: 'journal_entry_created' },
      { type: 'event', level: 'info', name: 'ai_analysis_started' },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.popularEvents).toEqual([
        { name: 'ai_analysis_started', count: 2 },
        { name: 'journal_entry_created', count: 1 },
      ]);
      done();
    });
  });

  it('should ignore errors in popular events', (done) => {
    const { service } = setup([
      { type: 'event', level: 'info', name: 'ai_analysis_started' },
      { type: 'error', level: 'error', name: 'ai_analysis_failed' },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.popularEvents).toEqual([
        { name: 'ai_analysis_started', count: 1 },
      ]);
      done();
    });
  });

  it('should return recent errors', (done) => {
    const createdAt = {
      toDate: () => new Date(2026, 4, 12, 10, 0),
    };

    const { service } = setup([
      {
        type: 'error',
        level: 'error',
        name: 'error_1',
        message: 'Ошибка 1',
        createdAt,
      },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.recentErrors).toEqual([
        {
          id: '1',
          type: 'error',
          level: 'error',
          name: 'error_1',
          userId: null,
          message: 'Ошибка 1',
          details: undefined,
          createdAt,
        },
      ]);
      done();
    });
  });

  it('should limit recent errors to ten items', (done) => {
    const logs = Array.from({ length: 12 }, (_, index) => ({
      type: 'error',
      level: 'error',
      name: `error_${index + 1}`,
    }));

    const { service } = setup(logs);

    service.getSummary().subscribe((summary) => {
      expect(summary.recentErrors.length).toBe(10);
      done();
    });
  });

  it('should use null user id when log has no user id', (done) => {
    const { service } = setup([
      { type: 'event', level: 'info', name: 'event_1' },
    ]);

    service.getSummary().subscribe((summary) => {
      expect(summary.recentErrors).toEqual([]);
      done();
    });
  });

  it('should handle empty logs list', (done) => {
    const { service } = setup();

    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual({
        totalLogs: 0,
        totalEvents: 0,
        totalErrors: 0,
        popularEvents: [],
        recentErrors: [],
      });
      done();
    });
  });
});
