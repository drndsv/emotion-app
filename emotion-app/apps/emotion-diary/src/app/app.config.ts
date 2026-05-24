import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  signal,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { EMOTION_API_URL } from '@emotion-app/emotion-analysis';
import { provideTaiga } from '@taiga-ui/core';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';

import { environment } from '../environments/environment';

import { appRoutes } from './app.routes';
import { VALIDATION_ERRORS_PROVIDER } from './core/config/validation-errors';
import { authTokenInterceptor } from './core/services/auth-token.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    { provide: EMOTION_API_URL, useValue: environment.apiUrl },
    provideHttpClient(withInterceptors([authTokenInterceptor])),
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
