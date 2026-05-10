import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RequestViewModel } from '../../../../domain/request.entity';

@Component({
  selector: 'app-request-detail-dialog',
  imports: [DecimalPipe, MatButton, MatDialogActions, MatDialogContent, MatIcon, TranslatePipe],
  templateUrl: './request-detail-dialog.html',
  styleUrl: './request-detail-dialog.css',
})
export class RequestDetailDialog {
  data = inject<RequestViewModel>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<RequestDetailDialog>);

  remainingDays = computed(() => {
    const diff = new Date(this.data.deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  totalRequested = computed(() =>
    this.data.items.reduce((total, item) => total + item.quantity * item.pricePerUnit, 0),
  );

  close() {
    this.dialogRef.close();
  }
}
