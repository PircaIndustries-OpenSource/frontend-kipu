import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';
import { ResendDialogComponent } from './verification-resend.component';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, AuthBannerComponent, TranslateModule],
  templateUrl: './verification.component.html',
})
export class VerificationComponent implements OnDestroy {
  private dialog = inject(MatDialog);

  isResendDisabled = signal<boolean>(false);
  countdown = signal<number>(15);

  private timerInterval: any;

  onResendCode(event: Event) {
    event.preventDefault();

    if (this.isResendDisabled()) return;

    this.dialog.open(ResendDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    this.isResendDisabled.set(true);
    this.countdown.set(15);

    this.timerInterval = setInterval(() => {
      this.countdown.update((c) => c - 1);

      if (this.countdown() <= 0) {
        clearInterval(this.timerInterval);
        this.isResendDisabled.set(false);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
