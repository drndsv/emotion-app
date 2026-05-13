import { Route } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { AppLayoutComponent } from './layout/app-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page/dashboard-page.component';
import { JournalDetailsPageComponent } from './pages/journal/journal-details-page/journal-details-page.component';
import { JournalFormPageComponent } from './pages/journal/journal-form-page/journal-form-page.component';
import { JournalPageComponent } from './pages/journal/journal-page/journal-page.component';
import { MonitoringPageComponent } from './pages/monitoring/monitoring-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page/profile-page.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginPageComponent,
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    component: RegisterPageComponent,
  },

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
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
        path: 'journal/:id/edit',
        component: JournalFormPageComponent,
      },
      {
        path: 'journal/:id',
        component: JournalDetailsPageComponent,
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
      },
      {
        path: 'monitoring',
        canActivate: [adminGuard],
        component: MonitoringPageComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: '**',
        component: NotFoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
