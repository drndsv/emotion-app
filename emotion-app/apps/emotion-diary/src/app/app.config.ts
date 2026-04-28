import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';

import { appRoutes } from './app.routes';
import { VALIDATION_ERRORS_PROVIDER } from './core/config/validation-errors';

export const appConfig: ApplicationConfig = {
  providers: [
    VALIDATION_ERRORS_PROVIDER,
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideTaiga(),
  ],
};
