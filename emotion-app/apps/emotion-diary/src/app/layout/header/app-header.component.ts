import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiAvatar } from '@taiga-ui/kit';
import { catchError, filter, of, switchMap } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TuiAvatar],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isAdmin = signal(false);

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== undefined),
        switchMap((user) => {
          if (user === null) {
            return of(null);
          }

          return this.userService.getUserById().pipe(
            catchError(() => {
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((appUser) => {
        this.isAdmin.set(appUser?.role === 'admin');
      });
  }
}
