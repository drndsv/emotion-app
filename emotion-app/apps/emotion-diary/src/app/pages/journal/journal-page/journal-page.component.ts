import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiInput } from '@taiga-ui/core';

interface JournalEntry {
  id: string;
  state: string;
  emoji: string;
  date: string;
  preview: string;
}

@Component({
  selector: 'app-journal-page',
  imports: [TuiButton, RouterLink, TuiInput, ReactiveFormsModule],
  templateUrl: './journal-page.component.html',
  styleUrl: './journal-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent {
  protected readonly searchControl = new FormControl('', { nonNullable: true });

  protected get filteredEntries(): readonly JournalEntry[] {
    const query = this.searchControl.value.trim().toLowerCase();

    if (!query) {
      return this.entries;
    }

    return this.entries.filter((entry) =>
      `${entry.state} ${entry.date} ${entry.preview}`
        .toLowerCase()
        .includes(query),
    );
  }

  protected readonly entries: readonly JournalEntry[] = [
    {
      id: '1',
      state: 'Спокойствие',
      emoji: '😌',
      date: '12 апр 2026',
      preview: 'Сегодня чувствую себя лучше...',
    },
    {
      id: '2',
      state: 'Тревога',
      emoji: '😟',
      date: '11 апр 2026',
      preview: 'В первой половине дня было напряжённо...',
    },
  ];
}
