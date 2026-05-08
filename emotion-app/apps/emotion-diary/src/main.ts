import { bootstrapApplication } from '@angular/platform-browser';
import { initializeFirebase } from '@emotion-app/firebase';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

initializeFirebase(environment.firebase, !environment.production);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
