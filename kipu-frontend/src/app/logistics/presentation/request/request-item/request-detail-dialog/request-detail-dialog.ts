import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { EnrichedRequest, LogisticsStore } from '../../../../application/logistics.store';
import { BudgetStore } from '../../../../../budget/application/budget-store';

@Component({
  selector: 'app-request-detail-dialog',
  imports: [
    DecimalPipe, MatButton, MatDialogActions, MatDialogContent,
    MatIcon, TranslatePipe, DatePipe,
  ],
  templateUrl: './request-detail-dialog.html',
  styleUrl: './request-detail-dialog.css',
})
export class RequestDetailDialog {
  data = inject<EnrichedRequest>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<RequestDetailDialog>);
  private logisticsStore = inject(LogisticsStore);
  private budgetStore = inject(BudgetStore);

  remainingDays = computed(() => {
    const diff = new Date(this.data.deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  requestedAmount = computed(() =>
    Math.ceil(this.data.items.reduce((total, item) => total + item.quantity * item.pricePerUnit, 0)),
  );

  private budgetItemsSig = signal<any[]>([]);

  private budgetItemsLoaded = false;

  constructor() {
    this.budgetStore.loadBudgetItems();
    effect(() => {
      const items = this.budgetStore.budgetItems();
      if (items.length > 0 && !this.budgetItemsLoaded) {
        this.budgetItemsSig.set(items);
        this.budgetItemsLoaded = true;
      }
    });
  }

  budgetLineName = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 'Sin asignar';
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.name ?? ('Linea #' + blId);
  });

  assignedBudget = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 0;
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.budgeted ?? 0;
  });
  executedAmount = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 0;
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.executed ?? 0;
  });
  availableAmount = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 0;
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.available ?? 0;
  });
  isOverBudget = computed(() => this.requestedAmount() > this.availableAmount());

  close() {
    this.dialogRef.close();
  }

  acceptRequest() {
    this.logisticsStore.updateRequestStatus(this.data.id, 'ACCEPTED', () => {
      this.dialogRef.close('updated');
    });
  }

  rejectRequest() {
    this.logisticsStore.updateRequestStatus(this.data.id, 'REFUSED', () => {
      this.dialogRef.close('updated');
    });
  }
}
