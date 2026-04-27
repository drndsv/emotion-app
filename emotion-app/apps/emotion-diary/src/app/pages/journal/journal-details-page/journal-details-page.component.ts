import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';

interface JournalDetails {
  id: string;
  date: string;
  selectedState: string;
  detectedState: string;
  finalState: string;
  text: string;
  analysis: string;
  recommendation: string;
}

@Component({
  selector: 'app-journal-details-page',
  imports: [RouterLink, TuiButton],
  templateUrl: './journal-details-page.component.html',
  styleUrl: './journal-details-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalDetailsPageComponent {
  protected readonly entry: JournalDetails = {
    id: '1',
    date: '14 апр 2026',
    selectedState: 'Спокойствие',
    detectedState: 'Грусть',
    finalState: 'Грусть',
    text: 'Сегодня я чувствую усталость и тревогу...',
    analysis: 'Текст выражает эмоциональную усталость и лёгкую грусть.',
    recommendation:
      'Небольшая прогулка или короткий отдых помогут снизить напряжение.',
  };
}
