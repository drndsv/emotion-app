import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiInput } from '@taiga-ui/core';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, TuiInput, ReactiveFormsModule, TuiButton],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  protected readonly nameControl = new FormControl('', {
    nonNullable: true,
  });

  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
  });

  protected readonly passwordControl = new FormControl('', {
    nonNullable: true,
  });
}
