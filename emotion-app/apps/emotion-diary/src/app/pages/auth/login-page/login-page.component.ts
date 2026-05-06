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
  AUTH_ERROR_MESSAGES,
  DEFAULT_AUTH_ERROR_MESSAGE,
} from '../../../core/config/auth-errors';
import { AuthService } from '../../../core/services/auth.service';

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
      validators: [Validators.required, Validators.minLength(6)],
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
          void this.router.navigate(['/dashboard']);
        },
        error: (error: { code?: string }) => {
          this.isLoading.set(false);

          this.errorMessage.set(
            error.code !== undefined
              ? (AUTH_ERROR_MESSAGES[error.code] ?? DEFAULT_AUTH_ERROR_MESSAGE)
              : DEFAULT_AUTH_ERROR_MESSAGE,
          );
        },
      });
  }
}
