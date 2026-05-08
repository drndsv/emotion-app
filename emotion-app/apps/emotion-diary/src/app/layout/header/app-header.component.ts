import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TuiAvatar],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {}
