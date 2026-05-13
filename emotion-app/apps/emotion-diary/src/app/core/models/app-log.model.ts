export type AppLogType = 'event' | 'error';

export interface AppLog {
  type: AppLogType;
  name: string;
  userId: string | null;
  message?: string;
  details?: Record<string, unknown>;
}
