import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {}
