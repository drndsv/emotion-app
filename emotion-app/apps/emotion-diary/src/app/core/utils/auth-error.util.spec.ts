import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR_MESSAGE,
} from '../config/auth-errors';

import { getAuthErrorMessage } from './auth-error.util';

describe('getAuthErrorMessage', () => {
  it('should return default message when error code is undefined', () => {
    expect(getAuthErrorMessage({})).toBe(DEFAULT_AUTH_ERROR_MESSAGE);
  });

  it('should return mapped message for known Firebase error code', () => {
    expect(getAuthErrorMessage({ code: 'auth/invalid-email' })).toBe(
      AUTH_ERROR_MESSAGES['auth/invalid-email'],
    );
  });

  it('should return default message for unknown error code', () => {
    expect(getAuthErrorMessage({ code: 'auth/unknown-error' })).toBe(
      DEFAULT_AUTH_ERROR_MESSAGE,
    );
  });
});
