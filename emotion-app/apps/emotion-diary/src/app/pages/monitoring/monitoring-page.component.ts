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

import {
  MONITORING_DATE_LOCALE,
  MONITORING_MESSAGES,
} from '../../core/constants/monitoring';
import { AppLogDocument, MonitoringSummary } from '../../core/models/monitoring-stat.model';
import { MonitoringService } from '../../core/services/monitoring.service';

@Component({
  selector: 'app-monitoring-page',
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
          this.errorMessage.set(MONITORING_MESSAGES.loadFailed);
          this.isLoading.set(false);
        },
      });
  }

  protected formatDate(log: AppLogDocument): string {
    const raw = log.createdAt;
    if (!raw) return MONITORING_MESSAGES.unknownDate;
    const date = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(date.getTime())) return MONITORING_MESSAGES.unknownDate;
    return date.toLocaleString(MONITORING_DATE_LOCALE);
  }
}
