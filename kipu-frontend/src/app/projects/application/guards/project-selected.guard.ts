import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const projectSelectedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const currentProjectId = localStorage.getItem('currentProjectId');

  if (!currentProjectId) {
    snackBar.open('Seleccione un proyecto para continuar', 'Entendido', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    router.navigate(['/projects']);
    return false;
  }
  return true;
};
