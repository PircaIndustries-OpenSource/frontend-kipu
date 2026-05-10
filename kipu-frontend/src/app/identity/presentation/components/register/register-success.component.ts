import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-register-success-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <div class="p-10 text-center text-white bg-slate-800/95 rounded-xl shadow-2xl border border-slate-600">
      <h2 class="text-4xl font-bold mb-4">¡Registro exitoso!</h2>
      <p class="text-lg text-slate-300 mb-8">
        Solo queda un último paso restante para empezar a utilizar la aplicación
      </p>
      <button mat-flat-button color="primary" class="py-6 px-12 text-lg rounded-md" (click)="closeDialog()">
        Continuar
      </button>
    </div>
  `,
})
export class RegisterSuccessDialogComponent {
    private dialogRef = inject(MatDialogRef<RegisterSuccessDialogComponent>);

    closeDialog(): void {
        this.dialogRef.close(true);
    }
}
