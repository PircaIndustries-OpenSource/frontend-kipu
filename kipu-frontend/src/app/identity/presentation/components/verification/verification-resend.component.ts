import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-resend-code-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div
      class="p-10 text-center text-white bg-slate-800/95 rounded-xl shadow-2xl border border-slate-600"
    >
      <h2 class="text-4xl font-bold mb-4">Codigo Reenviado</h2>
      <p class="text-lg text-slate-300 mb-8">
        Se le reenvio un el código de verificación a su número telefónico
      </p>
      <button
        mat-flat-button
        color="primary"
        class="py-6 px-12 text-lg rounded-md"
        (click)="closeDialog()"
      >
        Continuar
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
