import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';

@Component({
  selector: 'app-not-found-page.component',
  imports: [TuiBlockStatus, TuiButton, RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
