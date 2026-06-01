import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  MonitoringSummary,
} from '../models/monitoring-stat.model';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<MonitoringSummary> {
    return this.http.get<MonitoringSummary>(
      `${environment.apiUrl}/analytics/summary`,
    );
  }
}
