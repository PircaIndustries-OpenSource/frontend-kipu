import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-success-dialog',
  imports: [MatDialogModule, MatIconModule, MatButton, TranslatePipe],
  templateUrl: './request-success-dialog.html',
  styleUrl: './request-success-dialog.css',
})
export class RequestSuccessDialog {
  dialogRef = inject(MatDialogRef<RequestSuccessDialog>);
  router = inject(Router);
  goToRequestPage() {
    this.dialogRef.close();
    this.router.navigate(['/logistics/requests']).then();
  }
}
