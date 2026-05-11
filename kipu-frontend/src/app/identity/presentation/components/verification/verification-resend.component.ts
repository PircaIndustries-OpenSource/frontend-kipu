import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-resend-code-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <div
      class="p-10 text-center text-white bg-slate-800/95 rounded-xl shadow-2xl border border-slate-600"
    >
      <h2 class="text-4xl font-bold mb-4">{{ 'identity.resend_code_success_title' | translate }}</h2>
      <p class="text-lg text-slate-300 mb-8">
        {{ 'identity.resend_code_success_desc' | translate }}
      </p>
      <button
        mat-flat-button
        color="primary"
        class="py-6 px-12 text-lg rounded-md"
        (click)="closeDialog()"
      >
        {{ 'identity.continue_button' | translate }}
      </button>
    </div>
  `,
})
export class ResendDialogComponent {
  private dialogRef = inject(MatDialogRef<ResendDialogComponent>);

  closeDialog(): void {
    this.dialogRef.close(true);
  }
}
