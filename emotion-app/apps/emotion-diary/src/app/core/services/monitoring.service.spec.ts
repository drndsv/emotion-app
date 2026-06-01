import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  let httpMock: HttpTestingController;
  let service: MonitoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitoringService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MonitoringService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load monitoring summary from backend analytics endpoint', () => {
    const summary = {
      totalLogs: 3,
      totalEvents: 2,
      totalErrors: 1,
      popularEvents: [{ name: 'journal_entry_created', count: 2 }],
      recentErrors: [
        {
          id: 1,
          type: 'ERROR',
          level: 'ERROR',
          name: 'journal_entry_create_failed',
          message: 'Не удалось создать запись',
          details: null,
          createdAt: '2026-05-12T10:00:00',
        },
      ],
    };

    service.getSummary().subscribe((result) => {
      expect(result).toEqual(summary);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/analytics/summary`);

    expect(request.request.method).toBe('GET');

    request.flush(summary);
  });
});
