import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-journal-page',
  imports: [],
  templateUrl: './journal-page.component.html',
  styleUrl: './journal-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent {}
