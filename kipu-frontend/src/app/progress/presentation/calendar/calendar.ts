import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ProjectProgress } from '../../domain/progress.entity';
import localeEs from '@angular/common/locales/es';

// Register Spanish locales for the built-in DatePipe
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-progress-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslatePipe],
  templateUrl: './calendar.html',
})
export class ProgressCalendarComponent {
  private readonly translate = inject(TranslateService);

  @Input() progressList: ProjectProgress[] = [];
  @Input() currentProjectId: string | null = null;
  @Output() editMiniAdvance = new EventEmitter<ProjectProgress>();

  readonly calendarDate = signal<Date>(new Date());

  /**
   * Dynamically tracks the language token directly from Ngx-Translate state.
   */
  get currentLang(): string {
    return this.translate.currentLang || 'es';
  }

  /**
   * Generates the 42-day calendar matrix for the currently active month view.
   */
  readonly calendarWeeks = computed(() => {
    const date = this.calendarDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startSpacing = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const daysGrid: (Date | null)[] = Array(startSpacing).fill(null);

    for (let day = 1; day <= totalDays; day++) {
      daysGrid.push(new Date(year, month, day));
    }

    const remainingCells = 42 - daysGrid.length;
    for (let i = 0; i < remainingCells; i++) {
      daysGrid.push(null);
    }

    const weeks = [];
    while (daysGrid.length > 0) {
      weeks.push(daysGrid.splice(0, 7));
    }

    return weeks;
  });

  /**
   * Filters and retrieves matching child mini-advances running on a specific calendar day.
   */
  getMiniAdvancesForDate(date: Date | null): ProjectProgress[] {
    if (!date || !this.progressList) return [];

    return this.progressList.filter((item) => {
      // Keep only mini-advances (children) on the grid cells
      if (!item.isMiniAdvance) return false;

      // Identity matching validation for the active project
      if (this.currentProjectId && String(item.projectId) !== String(this.currentProjectId))
        return false;

      const itemDate = new Date(item.lastUpdate);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    });
  }

  changeMonth(offset: number): void {
    const current = this.calendarDate();
    this.calendarDate.set(new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  setToday(): void {
    this.calendarDate.set(new Date());
  }

  onMiniAdvanceClick(child: ProjectProgress): void {
    this.editMiniAdvance.emit(child);
  }
}
