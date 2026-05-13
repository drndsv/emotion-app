import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiInput } from '@taiga-ui/core';
import { TuiForm } from '@taiga-ui/layout';

import { AUTH_PASSWORD_MIN_LENGTH } from '../../../core/constants/auth';
import { LOGGER_EVENTS } from '../../../core/constants/logger';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';
import { getAuthErrorMessage } from '../../../core/utils/auth-error.util';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    TuiError,
    TuiInput,
    ReactiveFormsModule,
    TuiButton,
    TuiForm,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly loggerService = inject(LoggerService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(AUTH_PASSWORD_MIN_LENGTH),
      ],
    }),
  });

  protected login(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isLoading.set(true);

    this.authService
      .login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loggerService
            .logEvent(LOGGER_EVENTS.authLoginSuccess, { email })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              void this.router.navigate(['/dashboard']);
            });
        },
        error: (error: { code?: string }) => {
          this.isLoading.set(false);
          this.errorMessage.set(getAuthErrorMessage(error));

          this.loggerService
            .logError(LOGGER_EVENTS.authLoginFailed, error, { email })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }
}
