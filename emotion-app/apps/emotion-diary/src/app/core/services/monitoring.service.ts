import { Injectable } from '@angular/core';
import { getFirestoreInstance } from '@emotion-app/firebase';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

import { APP_LOGS_COLLECTION } from '../constants/logger';
import {
  AppLogDocument,
  MonitoringSummary,
} from '../models/monitoring-stat.model';

const MONITORING_LOGS_LIMIT = 200;
const MONITORING_RECENT_ERRORS_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  private readonly firestore = getFirestoreInstance();

  getSummary(): Observable<MonitoringSummary> {
    const logsQuery = query(
      collection(this.firestore, APP_LOGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(MONITORING_LOGS_LIMIT),
    );

    return from(getDocs(logsQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            type: data['type'],
            level: data['level'],
            name: data['name'],
            userId: data['userId'] ?? null,
            message: data['message'],
            details: data['details'],
            createdAt: data['createdAt'] as Timestamp | undefined,
          } as AppLogDocument;
        }),
      ),
      map((logs) => this.buildSummary(logs)),
    );
  }

  private buildSummary(logs: readonly AppLogDocument[]): MonitoringSummary {
    const events = logs.filter((log) => log.type === 'event');
    const errors = logs.filter((log) => log.type === 'error');

    return {
      totalLogs: logs.length,
      totalEvents: events.length,
      totalErrors: errors.length,
      popularEvents: this.getPopularEvents(events),
      recentErrors: errors.slice(0, MONITORING_RECENT_ERRORS_LIMIT),
    };
  }

  private getPopularEvents(
    events: readonly AppLogDocument[],
  ): readonly { name: string; count: number }[] {
    const eventCounts = new Map<string, number>();

    events.forEach((event) => {
      eventCounts.set(event.name, (eventCounts.get(event.name) ?? 0) + 1);
    });

    return Array.from(eventCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((first, second) => second.count - first.count);
  }
}
