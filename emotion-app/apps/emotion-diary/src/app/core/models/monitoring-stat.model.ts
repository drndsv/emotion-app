import { Timestamp } from 'firebase/firestore';

export interface AppLogDocument {
  id: string;
  type: 'event' | 'error';
  level: 'info' | 'error';
  name: string;
  userId: string | null;
  message?: string;
  details?: Record<string, unknown>;
  createdAt?: Timestamp;
}

export interface MonitoringEventStat {
  name: string;
  count: number;
}

export interface MonitoringSummary {
  totalLogs: number;
  totalEvents: number;
  totalErrors: number;
  popularEvents: readonly MonitoringEventStat[];
  recentErrors: readonly AppLogDocument[];
}
