import { inject, Injectable } from '@angular/core';
import { getFirestoreInstance } from '@emotion-app/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { catchError, from, Observable, of, tap } from 'rxjs';

import { APP_LOGS_COLLECTION, LOGGER_MESSAGES } from '../constants/logger';
import { AppLog } from '../models/app-log.model';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly firestore = getFirestoreInstance();
  private readonly authService = inject(AuthService);

  logEvent(
    name: string,
    details?: Record<string, unknown>,
  ): Observable<unknown> {
    return this.saveLog({
      type: 'event',
      level: 'info',
      name,
      userId: this.authService.currentUser?.uid ?? null,
      details,
    }).pipe(
      tap(() => {
        console.log(`[INFO] ${LOGGER_MESSAGES.eventSaved}`, name, details);
      }),
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
      userId: this.authService.currentUser?.uid ?? null,
      message,
      details,
    }).pipe(
      tap(() => {
        console.error(
          `[ERROR] ${LOGGER_MESSAGES.errorSaved}`,
          name,
          message,
          details,
        );
      }),
    );
  }

  private saveLog(log: AppLog): Observable<unknown> {
    const logData = {
      type: log.type,
      level: log.level,
      name: log.name,
      userId: log.userId,
      ...(log.message ? { message: log.message } : {}),
      ...(log.details ? { details: log.details } : {}),
      createdAt: serverTimestamp(),
    };

    return from(
      addDoc(collection(this.firestore, APP_LOGS_COLLECTION), logData),
    ).pipe(
      catchError((error: unknown) => {
        console.error('[ERROR]', LOGGER_MESSAGES.saveFailed, error);

        return of(null);
      }),
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
