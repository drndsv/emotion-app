import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LOGGER_MESSAGES } from '../constants/logger';
import { AppLog } from '../models/app-log.model';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  logEvent(
    name: string,
    details?: Record<string, unknown>,
  ): Observable<unknown> {
    const log: AppLog = {
      type: 'EVENT',
      level: 'INFO',
      name,
      userId: this.authService.currentUser?.uid ?? null,
      details,
    };

    return this.saveLog(log).pipe(
      tap(() =>
        console.log(`[INFO] ${LOGGER_MESSAGES.eventSaved}`, name, details),
      ),
    );
  }

  logError(
    name: string,
    error: unknown,
    details?: Record<string, unknown>,
  ): Observable<unknown> {
    const message = this.getErrorMessage(error);

    const log: AppLog = {
      type: 'ERROR',
      level: 'ERROR',
      name,
      userId: this.authService.currentUser?.uid ?? null,
      message,
      details,
    };

    return this.saveLog(log).pipe(
      tap(() =>
        console.error(
          `[ERROR] ${LOGGER_MESSAGES.errorSaved}`,
          name,
          message,
          details,
        ),
      ),
    );
  }

  private saveLog(log: AppLog): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/monitoring/logs`, {
      type: log.type,
      level: log.level,
      name: log.name,
      message: log.message ?? null,
      details: log.details ? JSON.stringify(log.details) : null,
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
