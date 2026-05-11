import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-success-dialog',
  imports: [MatButton, MatDialogClose, MatIcon, TranslatePipe],
  templateUrl: './success-dialog.html',
  styleUrl: './success-dialog.css',
})
export class SuccessDialog {
  private data = inject(MAT_DIALOG_DATA);
  title = input<string>(this.data?.title);
  subtitle = input<string>(this.data?.subtitle);
  textButton = input<string>(this.data?.textButton);
}
