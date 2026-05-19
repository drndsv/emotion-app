import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LOGGER_MESSAGES } from '../constants/logger';
import { AppLog } from '../models/app-log.model';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  logEvent(
    name: string,
    details?: Record<string, unknown>,
  ): Observable<unknown> {
    return this.saveLog({
      type: 'event',
      level: 'info',
      name,
      userId: null,
      details,
    }).pipe(
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

    return this.saveLog({
      type: 'error',
      level: 'error',
      name,
      userId: null,
      message,
      details,
    }).pipe(
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
    const safeDetails = log.details
      ? JSON.parse(JSON.stringify(log.details))
      : undefined;

    return this.http.post(`${this.api}/logs`, {
      type: log.type,
      level: log.level,
      name: log.name,
      message: log.message,
      details: safeDetails,
    });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
