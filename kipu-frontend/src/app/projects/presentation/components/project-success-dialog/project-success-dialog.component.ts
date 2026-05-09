import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-success-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center p-6 text-center">
      <div class="bg-green-100 text-green-600 rounded-full p-4 mb-4">
        <mat-icon class="scale-150">check_circle</mat-icon>
      </div>
      <h2 class="text-xl font-bold mb-2">Proyecto creado de manera exitosa</h2>
      <p class="text-gray-500 mb-6">El nuevo proyecto ha sido registrado y está listo para ser gestionado.</p>
      <button mat-flat-button color="primary" mat-dialog-close class="w-full !py-6">Entendido</button>
    </div>
  `
})
export class ProjectSuccessDialogComponent {}
