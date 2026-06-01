export type AppLogType =
  | 'EVENT'
  | 'ERROR'
  | 'AUTH'
  | 'JOURNAL'
  | 'ANALYSIS'
  | 'SYSTEM'
  | 'MONITORING';

export type AppLogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface AppLog {
  type: AppLogType;
  level: AppLogLevel;
  name: string;
  userId: string | null;
  message?: string;
  details?: Record<string, unknown>;
}

export interface AppLogResponse {
  id: number;
  level: AppLogLevel;
  type: AppLogType;
  name: string;
  message: string | null;
  details: string | null;
  createdAt: string | null;
}
