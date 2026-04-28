export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Введите корректный email.',
  'auth/user-not-found': 'Пользователь с таким email не найден.',
  'auth/wrong-password': 'Неверный пароль.',
  'auth/invalid-credential': 'Неверный email или пароль.',
  'auth/email-already-in-use': 'Пользователь с таким email уже существует.',
  'auth/weak-password': 'Пароль должен содержать минимум 6 символов.',
};

export const DEFAULT_AUTH_ERROR_MESSAGE =
  'Произошла ошибка. Попробуйте ещё раз.';
