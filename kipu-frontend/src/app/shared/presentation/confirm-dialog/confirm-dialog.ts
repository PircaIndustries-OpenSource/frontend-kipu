import { Component, inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [TranslatePipe, MatIcon, MatButton, MatDialogClose],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialog>);
  title = input<string>(this.data?.title);
  subtitle = input<string>(this.data?.subtitle);
  confirmText = input<string>(this.data?.confirmText);
  onConfirm() {
    this.dialogRef.close(true);
  }
}
