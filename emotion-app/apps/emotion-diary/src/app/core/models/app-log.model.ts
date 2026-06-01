export type AppLogType = 'EVENT' | 'ERROR';

export type AppLogLevel = 'INFO' | 'ERROR';

export interface AppLog {
  type: AppLogType;
  level: AppLogLevel;
  name: string;
  userId: string | null;
  message?: string;
  details?: Record<string, unknown>;
}
