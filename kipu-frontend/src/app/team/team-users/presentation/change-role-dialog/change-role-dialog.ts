import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-role-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, TranslatePipe, FormsModule],
  template: `
    <h2 mat-dialog-title>Cambiar Rol</h2>
    <mat-dialog-content>
      <p class="text-gray-600 mb-4">Selecciona el nuevo rol para <strong>{{ data.user.fullName }}</strong></p>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Nuevo Rol</mat-label>
        <mat-select [(ngModel)]="selectedRole">
          <mat-option value="Administrador">Administrador</mat-option>
          <mat-option value="Logística">Logística</mat-option>
          <mat-option value="Gestor Operativo">Gestor Operativo</mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="!pb-6 !px-6">
      <button mat-button mat-dialog-close class="!rounded-md">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!selectedRole" (click)="onConfirm()" class="!bg-accent !rounded-md">
        Guardar
      </button>
    </mat-dialog-actions>
  `
})
export class ChangeRoleDialog {
  private dialogRef = inject(MatDialogRef<ChangeRoleDialog>);
  public data = inject(MAT_DIALOG_DATA);

  selectedRole = this.data.user.role || '';

  onConfirm() {
    this.dialogRef.close(this.selectedRole);
  }
}
