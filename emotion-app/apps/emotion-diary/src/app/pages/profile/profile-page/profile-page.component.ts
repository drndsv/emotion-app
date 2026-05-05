import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiInput, TuiLoader } from '@taiga-ui/core';
import { filter } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  imports: [TuiButton, TuiInput, ReactiveFormsModule, TuiLoader],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    validators: [Validators.required, Validators.minLength(6)],
  });

  constructor() {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== undefined),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        this.isLoading.set(false);

        if (user === null) {
          this.errorMessage.set('Пользователь не авторизован');

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
      this.errorMessage.set('Введите имя');

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
          this.successMessage.set('Данные профиля сохранены');
        },
        error: () => {
          this.isSaving.set(false);
          this.errorMessage.set('Не удалось сохранить данные профиля');
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
      this.errorMessage.set('Введите корректный email и текущий пароль');

      return;
    }

    this.isChangingEmail.set(true);
    this.clearMessages();

    this.authService
      .changeEmail(this.emailPasswordControl.value, this.newEmailControl.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isChangingEmail.set(false);
          this.isEmailEditMode.set(false);
          this.newEmailControl.reset();
          this.emailPasswordControl.reset();
          this.successMessage.set(
            'Письмо для подтверждения нового email отправлено. Перейдите по ссылке в письме.',
          );
        },
        error: () => {
          this.isChangingEmail.set(false);
          this.errorMessage.set(
            'Не удалось отправить письмо для смены email. Проверьте текущий пароль или попробуйте другой email.',
          );
        },
      });
  }

  protected changePassword(): void {
    if (
      this.currentPasswordControl.invalid ||
      this.newPasswordControl.invalid
    ) {
      this.errorMessage.set(
        'Введите текущий пароль и новый пароль не короче 6 символов',
      );

      return;
    }

    this.isChangingPassword.set(true);
    this.clearMessages();

    this.authService
      .changePassword(
        this.currentPasswordControl.value,
        this.newPasswordControl.value,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isChangingPassword.set(false);
          this.isPasswordEditMode.set(false);
          this.currentPasswordControl.reset();
          this.newPasswordControl.reset();
          this.successMessage.set('Пароль успешно изменён');
        },
        error: () => {
          this.isChangingPassword.set(false);
          this.errorMessage.set(
            'Не удалось изменить пароль. Проверьте текущий пароль.',
          );
        },
      });
  }

  protected logout(): void {
    this.isLogoutLoading.set(true);
    this.clearMessages();

    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLogoutLoading.set(false);
          void this.router.navigate(['/login']);
        },
        error: () => {
          this.isLogoutLoading.set(false);
          this.errorMessage.set('Не удалось выйти из аккаунта');
        },
      });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
