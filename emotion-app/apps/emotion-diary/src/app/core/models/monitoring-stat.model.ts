import { AppLogResponse } from './app-log.model';

export interface MonitoringEventStat {
  name: string;
  count: number;
}

export interface MonitoringSummary {
  totalLogs: number;
  totalEvents: number;
  totalErrors: number;
  popularEvents: readonly MonitoringEventStat[];
  recentErrors: readonly AppLogResponse[];
}
