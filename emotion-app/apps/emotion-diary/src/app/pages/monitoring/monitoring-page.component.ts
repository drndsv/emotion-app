import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiLoader } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

import { MonitoringSummary } from '../../core/models/monitoring-stat.model';
import { MonitoringService } from '../../core/services/monitoring.service';

@Component({
  selector: 'app-monitoring-page.component',
  imports: [TuiLoader, TuiCardLarge],
  templateUrl: './monitoring-page.component.html',
  styleUrl: './monitoring-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPageComponent implements OnInit {
  private readonly monitoringService = inject(MonitoringService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly summary = signal<MonitoringSummary | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.monitoringService
      .getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          this.summary.set(summary);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Не удалось загрузить данные мониторинга');
          this.isLoading.set(false);
        },
      });
  }

  protected formatDate(log: { createdAt?: { toDate: () => Date } }): string {
    if (!log.createdAt) {
      return 'Дата неизвестна';
    }

    return log.createdAt.toDate().toLocaleString('ru-RU');
  }
}
