import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiInput } from '@taiga-ui/core';

@Component({
  selector: 'app-profile-page',
  imports: [TuiButton, TuiInput, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
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
}
