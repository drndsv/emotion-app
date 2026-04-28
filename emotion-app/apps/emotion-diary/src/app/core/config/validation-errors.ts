import { TUI_VALIDATION_ERRORS } from '@taiga-ui/core';

export const VALIDATION_ERRORS_PROVIDER = {
  provide: TUI_VALIDATION_ERRORS,
  useValue: {
    required: 'Поле обязательно для заполнения',
    email: 'Введите корректный email',
    minlength: ({ requiredLength }: { requiredLength: number }) =>
      `Минимальная длина — ${requiredLength} символов`,
    maxlength: ({ requiredLength }: { requiredLength: number }) =>
      `Максимальная длина — ${requiredLength} символов`,
  },
};
