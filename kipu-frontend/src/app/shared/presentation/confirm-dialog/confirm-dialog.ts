import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatRipple, MatIcon, TranslatePipe],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  data = inject<{ title: string; message: string; itemName: string }>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialog>);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
