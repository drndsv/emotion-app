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

import {
  AUTH_NAME_MIN_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
} from '../../../core/constants/auth';
import { LOGGER_EVENTS } from '../../../core/constants/logger';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';
import { getAuthErrorMessage } from '../../../core/utils/auth-error.util';

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink,
    TuiInput,
    ReactiveFormsModule,
    TuiButton,
    TuiError,
    TuiForm,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly loggerService = inject(LoggerService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(AUTH_NAME_MIN_LENGTH),
      ],
    }),
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

  protected register(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { name, email, password } = this.form.getRawValue();

    this.isLoading.set(true);

    this.authService
      .register(email, password, name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loggerService
            .logEvent(LOGGER_EVENTS.authRegistrationSuccess, { email })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              void this.router.navigate(['/dashboard']);
            });
        },
        error: (error: { code?: string }) => {
          this.isLoading.set(false);
          this.errorMessage.set(getAuthErrorMessage(error));

          this.loggerService
            .logError(LOGGER_EVENTS.authRegistrationFailed, error, { email })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }
}
