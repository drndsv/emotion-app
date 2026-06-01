import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiInput, TuiLoader } from '@taiga-ui/core';
import { filter, switchMap } from 'rxjs';

import { AUTH_PASSWORD_MIN_LENGTH } from '../../../core/constants/auth';
import { LOGGER_EVENTS } from '../../../core/constants/logger';
import { PROFILE_MESSAGES } from '../../../core/constants/profile';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-profile-page',
  imports: [TuiButton, TuiInput, ReactiveFormsModule, TuiLoader],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly loggerService = inject(LoggerService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly passwordMinLength = AUTH_PASSWORD_MIN_LENGTH;

  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly isChangingPassword = signal(false);
  protected readonly isChangingEmail = signal(false);
  protected readonly isLogoutLoading = signal(false);

  protected readonly isEditMode = signal(false);
  protected readonly isEmailEditMode = signal(false);
  protected readonly isPasswordEditMode = signal(false);

  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly newEmailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly emailPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly currentPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly newPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(AUTH_PASSWORD_MIN_LENGTH),
    ],
  });

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== undefined),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        this.isLoading.set(false);

        if (user === null) {
          this.errorMessage.set(PROFILE_MESSAGES.notAuthorized);

          return;
        }

        this.nameControl.setValue(user.displayName ?? '');
        this.emailControl.setValue(user.email ?? '');
      });
  }

  protected toggleEditMode(): void {
    this.clearMessages();
    this.isEditMode.set(!this.isEditMode());
  }

  protected togglePasswordEditMode(): void {
    this.clearMessages();
    this.isPasswordEditMode.set(!this.isPasswordEditMode());

    this.currentPasswordControl.reset();
    this.newPasswordControl.reset();
  }

  protected saveProfile(): void {
    if (this.nameControl.invalid) {
      this.errorMessage.set(PROFILE_MESSAGES.nameRequired);

      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    this.authService
      .updateProfileData(this.nameControl.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isEditMode.set(false);
          this.successMessage.set(PROFILE_MESSAGES.profileSaved);

          this.loggerService
            .logEvent(LOGGER_EVENTS.profileUpdated)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
        error: (error: unknown) => {
          this.isSaving.set(false);
          this.errorMessage.set(PROFILE_MESSAGES.profileSaveFailed);

          this.loggerService
            .logError(LOGGER_EVENTS.profileUpdateFailed, error)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  protected toggleEmailEditMode(): void {
    this.clearMessages();
    this.isEmailEditMode.set(!this.isEmailEditMode());

    this.newEmailControl.setValue(this.emailControl.value);
    this.emailPasswordControl.reset();
  }

  protected changeEmail(): void {
    if (this.newEmailControl.invalid || this.emailPasswordControl.invalid) {
      this.errorMessage.set(PROFILE_MESSAGES.emailInvalid);

      return;
    }

    this.isChangingEmail.set(true);
    this.clearMessages();

    this.authService
      .changeEmail({
        currentPassword: this.emailPasswordControl.value,
        newEmail: this.newEmailControl.value,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isChangingEmail.set(false);
          this.isEmailEditMode.set(false);
          this.newEmailControl.reset();
          this.emailPasswordControl.reset();
          this.successMessage.set(PROFILE_MESSAGES.emailChanged);

          this.loggerService
            .logEvent(LOGGER_EVENTS.emailChanged)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
        error: (error: unknown) => {
          this.isChangingEmail.set(false);
          this.errorMessage.set(PROFILE_MESSAGES.emailChangeFailed);

          this.loggerService
            .logError(LOGGER_EVENTS.emailChangeFailed, error)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  protected changePassword(): void {
    if (
      this.currentPasswordControl.invalid ||
      this.newPasswordControl.invalid
    ) {
      this.errorMessage.set(PROFILE_MESSAGES.passwordInvalid);

      return;
    }

    this.isChangingPassword.set(true);
    this.clearMessages();

    this.authService.changePassword({
      currentPassword: this.currentPasswordControl.value,
      newPassword: this.newPasswordControl.value,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isChangingPassword.set(false);
          this.isPasswordEditMode.set(false);
          this.currentPasswordControl.reset();
          this.newPasswordControl.reset();
          this.successMessage.set(PROFILE_MESSAGES.passwordChanged);

          this.loggerService
            .logEvent(LOGGER_EVENTS.passwordChanged)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
        error: (error: unknown) => {
          this.isChangingPassword.set(false);
          this.errorMessage.set(PROFILE_MESSAGES.passwordChangeFailed);

          this.loggerService
            .logError(LOGGER_EVENTS.passwordChangeFailed, error)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  protected logout(): void {
    this.isLogoutLoading.set(true);
    this.clearMessages();

    this.loggerService
      .logEvent(LOGGER_EVENTS.authLogoutSuccess)
      .pipe(
        switchMap(() => this.authService.logout()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isLogoutLoading.set(false);

          void this.router.navigate(['/login']);
        },
        error: (error: unknown) => {
          this.isLogoutLoading.set(false);
          this.errorMessage.set(PROFILE_MESSAGES.logoutFailed);

          this.loggerService
            .logError(LOGGER_EVENTS.authLogoutFailed, error)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
