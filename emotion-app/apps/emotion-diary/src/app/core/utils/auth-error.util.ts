import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR_MESSAGE,
} from '../config/auth-errors';

export function getAuthErrorMessage(error: { code?: string }): string {
  if (error.code === undefined) {
    return DEFAULT_AUTH_ERROR_MESSAGE;
  }

  return AUTH_ERROR_MESSAGES[error.code] ?? DEFAULT_AUTH_ERROR_MESSAGE;
}
