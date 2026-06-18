import { Component, computed, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EnrichedRequest } from '../../../application/logistics.store';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RequestModifyDialog } from './request-modify-dialog/request-modify-dialog';
import { RequestDetailDialog } from './request-detail-dialog/request-detail-dialog';
import { LogisticsStore } from '../../../application/logistics.store';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-request-item',
  imports: [MatCardModule, TranslatePipe, MatRipple, MatDialogModule, DatePipe, NgClass, MatIconModule],
  templateUrl: './request-item.html',
  styleUrl: './request-item.css',
})
export class RequestItem {
  request = input.required<EnrichedRequest>();
  availableBudget = input.required<number>();
  totalBudget = input.required<number>();
  private dialog = inject(MatDialog);
  private store = inject(LogisticsStore);

  remainingDays = computed(() => {
    const difference = new Date(this.request().deadline).getTime() - Date.now();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  });
  requestedAmount = computed(() => {
    return this.request().items.reduce((total, item) => {
      return total + Math.ceil(item.quantity * item.pricePerUnit);
    }, 0);
  });
  isAmountValid = computed(() => {
    return this.availableBudget() + this.requestedAmount() <= this.totalBudget();
  });

  openModifyDialog() {
    const ref = this.dialog.open(RequestModifyDialog, {
      width: '550px',
      disableClose: true,
      data: this.request(),
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.store.updateRequest(this.request().id, result);
      }
    });
  }

  openDetailDialog() {
    const ref = this.dialog.open(RequestDetailDialog, {
      width: '750px',
      data: this.request(),
    });
    ref.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.store.loadRequest(true);
      }
    });
  }
}
