import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { LOGGER_MESSAGES } from '../constants/logger';
import { AppLog } from '../models/app-log.model';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly authService = inject(AuthService);

  logEvent(name: string, details?: Record<string, unknown>): Observable<unknown> {
    return this.saveLog({
      type: 'event',
      level: 'info',
      name,
      userId: this.authService.currentUser?.uid ?? null,
      details,
    }).pipe(tap(() => console.log(`[INFO] ${LOGGER_MESSAGES.eventSaved}`, name, details)));
  }

  logError(name: string, error: unknown, details?: Record<string, unknown>): Observable<unknown> {
    const message = this.getErrorMessage(error);
    return this.saveLog({
      type: 'error',
      level: 'error',
      name,
      userId: this.authService.currentUser?.uid ?? null,
      message,
      details,
    }).pipe(tap(() => console.error(`[ERROR] ${LOGGER_MESSAGES.errorSaved}`, name, message, details)));
  }

  private saveLog(log: AppLog): Observable<unknown> {
    const safeDetails = log.details ? JSON.parse(JSON.stringify(log.details)) : undefined;
    // Firebase logging disabled after backend migration.
    return of({ ...log, details: safeDetails, createdAt: new Date().toISOString() });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
