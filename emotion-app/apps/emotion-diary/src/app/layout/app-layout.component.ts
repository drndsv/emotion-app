import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from './header/app-header.component';

@Component({
  selector: 'app-app-layout.component',
  imports: [AppHeaderComponent, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {}
