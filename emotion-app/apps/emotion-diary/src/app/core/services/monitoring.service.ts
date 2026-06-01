import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  MonitoringSummary,
} from '../models/monitoring-stat.model';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  getSummary(): Observable<MonitoringSummary> {
    return of({
      totalLogs: 0,
      totalEvents: 0,
      totalErrors: 0,
      popularEvents: [],
      recentErrors: [],
    });
  }
}
