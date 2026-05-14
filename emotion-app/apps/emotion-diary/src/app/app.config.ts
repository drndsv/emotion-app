import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  signal,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';

import { appRoutes } from './app.routes';
import { VALIDATION_ERRORS_PROVIDER } from './core/config/validation-errors';

export const appConfig: ApplicationConfig = {
  providers: [
    VALIDATION_ERRORS_PROVIDER,
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withHashLocation()),
    provideTaiga(),
    {
      provide: TUI_LANGUAGE,
      useValue: signal(TUI_RUSSIAN_LANGUAGE),
    },
  ],
};
