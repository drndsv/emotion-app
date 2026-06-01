export const PROFILE_MESSAGES = {
  notAuthorized: 'Пользователь не авторизован',
  nameRequired: 'Введите имя',
  profileSaved: 'Данные профиля сохранены',
  profileSaveFailed: 'Не удалось сохранить данные профиля',
  emailInvalid: 'Введите корректный email и текущий пароль',
  emailChanged: 'Email успешно изменён',
  emailChangeFailed:
    'Не удалось изменить email. Проверьте текущий пароль или попробуйте другой email.',
  passwordInvalid: 'Введите текущий пароль и новый пароль не короче 6 символов',
  passwordChanged: 'Пароль успешно изменён',
  passwordChangeFailed: 'Не удалось изменить пароль. Проверьте текущий пароль.',
  logoutFailed: 'Не удалось выйти из аккаунта',
} as const;
