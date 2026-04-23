import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {}
