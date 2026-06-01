import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, filter, map, of, switchMap, take } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    filter((user) => user !== undefined),
    take(1),
    switchMap((user) => {
      if (user === null) {
        return of(router.createUrlTree(['/login']));
      }

      return userService.getUserById().pipe(
        map((appUser) => {
          if (appUser?.role === 'admin') {
            return true;
          }

          return router.createUrlTree(['/dashboard']);
        }),
        catchError(() => of(router.createUrlTree(['/dashboard']))),
      );
    }),
  );
};
