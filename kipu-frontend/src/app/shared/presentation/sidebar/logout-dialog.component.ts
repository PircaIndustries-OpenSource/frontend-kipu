import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="p-6 text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <mat-icon class="text-blue-500 scale-150">check_circle</mat-icon>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Hasta pronto!</h2>
      <p class="text-gray-600 mb-6">
        Se ha cerrado sesión correctamente.
      </p>
      <button mat-flat-button color="primary" class="w-full !py-6" mat-dialog-close>
        Continuar
      </button>
    </div>
  `
})
export class LogoutDialogComponent { }
