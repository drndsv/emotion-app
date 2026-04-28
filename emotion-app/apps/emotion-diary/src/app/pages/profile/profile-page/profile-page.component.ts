import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiInput } from '@taiga-ui/core';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  imports: [TuiButton, TuiInput, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected isEditMode = false;

  protected readonly nameControl = new FormControl('Иван', {
    nonNullable: true,
  });

  protected readonly emailControl = new FormControl('ivan@example.ru', {
    nonNullable: true,
  });

  protected readonly passwordControl = new FormControl('************', {
    nonNullable: true,
  });

  protected toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  protected saveProfile(): void {
    this.isEditMode = false;
  }

  protected logout(): void {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login']);
        },
      });
  }
}
