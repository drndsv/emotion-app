export type AppLogType = 'event' | 'error';

export type AppLogLevel = 'info' | 'error';

export interface AppLog {
  type: AppLogType;
  level: AppLogLevel;
  name: string;
  userId: string | null;
  message?: string;
  details?: Record<string, unknown>;
}
