import { Route } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page/dashboard-page.component';
import { JournalDetailsPageComponent } from './pages/journal/journal-details-page/journal-details-page.component';
import { JournalFormPageComponent } from './pages/journal/journal-form-page/journal-form-page.component';
import { JournalPageComponent } from './pages/journal/journal-page/journal-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },

  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'journal',
        component: JournalPageComponent,
      },
      {
        path: 'journal/new',
        component: JournalFormPageComponent,
      },
      {
        path: 'journal/:id',
        component: JournalDetailsPageComponent,
      },
      {
        path: 'journal/:id/edit',
        component: JournalFormPageComponent,
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
