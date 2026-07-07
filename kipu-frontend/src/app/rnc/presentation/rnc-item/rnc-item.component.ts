import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { RncEntity, SolutionLog } from '../../domain/model/rnc.entity';
import { RncStore } from '../../application/rnc.store';
import { ConfirmDialog } from '../../../shared/presentation/confirm-dialog/confirm-dialog';
import { RncActionDialogComponent } from '../rnc-action-dialog/rnc-action-dialog.component';
import { RncStatusDialogComponent } from '../rnc-status-dialog/rnc-status-dialog.component';
import { RncHistoryDialogComponent } from '../rnc-history-dialog/rnc-history-dialog.component';

@Component({
  selector: 'app-rnc-item',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './rnc-item.component.html',
})
export class RncItemComponent {
  rnc = input.required<RncEntity>();
  private store = inject(RncStore);
  private dialog = inject(MatDialog);

  getSeverityClass(): string {
    const severity = this.rnc().severity;
    if (severity === 'Critical') return 'bg-red-100 text-red-700 border-red-200';
    if (severity === 'Moderate') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }

  calculateDaysOpen(): number {
    const created = new Date(this.rnc().reportDate).getTime();
    const now = new Date().getTime();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'rnc.dialog.delete_title',
        message: 'rnc.dialog.delete_subtitle',
        itemName: this.rnc().title,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.delete(this.rnc().id);
      }
    });
  }

  onRegisterSolution(): void {
    const dialogRef = this.dialog.open(RncActionDialogComponent, {
      width: '400px',
      data: { action: 'solve', title: 'rnc.dialog.solve_title' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // We check if result exists and contains the necessary info
      if (result) {
        const newLog: SolutionLog = {
          date: new Date(),
          note: result.value || 'No details provided', // Ensure we use 'value' as per your dialog
          author: 'Current User',
        };

        this.store.update({
          ...this.rnc(),
          status: result.status,
          severity: result.severity,
          solutionNotes: [...(this.rnc().solutionNotes || []), newLog],
        });
      }
    });
  }

  onAssign(): void {
    const dialogRef = this.dialog.open(RncActionDialogComponent, {
      width: '400px',
      data: { action: 'assign', title: 'rnc.dialog.assign_title' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Assigned user:', result);
      }
    });
  }

  onChangeStatus(): void {
    const dialogRef = this.dialog.open(RncActionDialogComponent, {
      width: '400px',
      data: {
        action: 'changeStatus',
        title: 'rnc.dialog.change_status_title',
        currentStatus: this.rnc().status,
        currentSeverity: this.rnc().severity,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.update({
          ...this.rnc(),
          status: result.status,
          severity: result.severity,
        });
      }
    });
  }

  getStatusClass(): string {
    return this.rnc().status === 'Solved'
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-neutral-100 text-neutral-600 border border-neutral-300';
  }

  onSeverityClick(): void {
    const dialogRef = this.dialog.open(RncStatusDialogComponent, {
      width: '400px',
      data: {
        title: 'Edit Status & Severity',
        currentStatus: this.rnc().status,
        currentSeverity: this.rnc().severity,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.update({
          ...this.rnc(),
          status: result.status,
          severity: result.severity,
        });
      }
    });
  }

  getLabelClass(): string {
    if (this.rnc().status === 'Solved') {
      return 'bg-green-100 text-green-700 border border-green-200';
    }

    const severity = this.rnc().severity;
    if (severity === 'Critical') return 'bg-red-100 text-red-700 border-red-200';
    if (severity === 'Moderate') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }

  onViewSolutionHistory(): void {
    this.dialog.open(RncHistoryDialogComponent, {
      width: '400px',
      data: { logs: this.rnc().solutionNotes || [] },
    });
  }
}
