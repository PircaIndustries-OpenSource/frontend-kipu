import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { EnrichedRequest, LogisticsStore } from '../../../../application/logistics.store';
import { TeamUsersStore } from '../../../../../team/team-users/application/team-users.store';
import { BudgetStore } from '../../../../../budget/application/budget-store';

@Component({
  selector: 'app-request-detail-dialog',
  imports: [
    DecimalPipe,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatIcon,
    TranslatePipe,
    DatePipe,
  ],
  templateUrl: './request-detail-dialog.html',
  styleUrl: './request-detail-dialog.css',
})
export class RequestDetailDialog {
  data = inject<EnrichedRequest>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<RequestDetailDialog>);
  private store = inject(LogisticsStore);
  private teamUsersStore = inject(TeamUsersStore);
  private budgetStore = inject(BudgetStore);

  processing = false;

  isLogistica = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Logística' || role === 'Administrador' || role === 'ROLE_ADMIN';
  });

  remainingDays = computed(() => {
    const diff = new Date(this.data.deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  totalRequested = computed(() =>
    this.data.items.reduce((total, item) => total + item.quantity * item.pricePerUnit, 0),
  );

  budgetExceeded = computed(() => {
    const budgetItems = this.budgetStore.budgetItems();
    const target = budgetItems.find((b) => String(b.id) === this.data.budgetLineId);
    if (!target) return false;
    return this.totalRequested() > target.available;
  });

  accept() {
    if (this.processing || this.budgetExceeded()) return;
    this.processing = true;
    this.store.updateRequestStatus(this.data.id, 'ACCEPTED', () => {
      this.dialogRef.close();
    });
  }

  reject() {
    if (this.processing) return;
    this.processing = true;
    this.store.updateRequestStatus(this.data.id, 'REFUSED', () => {
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
