import { HttpErrorResponse } from '@angular/common/http';

import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR_MESSAGE,
} from '../config/auth-errors';

export function getAuthErrorMessage(error: { code?: string } | unknown): string {
  if (isAuthErrorCode(error)) {
    return AUTH_ERROR_MESSAGES[error.code] ?? DEFAULT_AUTH_ERROR_MESSAGE;
  }

  if (error instanceof HttpErrorResponse) {
    return error.error?.message ?? DEFAULT_AUTH_ERROR_MESSAGE;
  }

  return DEFAULT_AUTH_ERROR_MESSAGE;
}

function isAuthErrorCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  );
}
