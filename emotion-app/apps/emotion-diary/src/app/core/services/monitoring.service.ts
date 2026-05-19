import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MonitoringSummary } from '../models/monitoring-stat.model';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<MonitoringSummary> {
    return this.http.get<MonitoringSummary>(`${this.api}/monitoring/summary`);
  }
}
