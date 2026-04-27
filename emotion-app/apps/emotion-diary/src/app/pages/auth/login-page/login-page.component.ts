import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiInput } from '@taiga-ui/core';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, TuiInput, ReactiveFormsModule, TuiButton],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
  });

  protected readonly passwordControl = new FormControl('', {
    nonNullable: true,
  });
}
