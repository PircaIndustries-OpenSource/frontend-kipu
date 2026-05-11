import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-machinery-maintenance-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './machinery-maintenance-dialog.html',
})
export class MachineryMaintenanceDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineryMaintenanceDialog>);

  maintenanceForm: FormGroup = this.fb.group({
    physicalStatus: ['', Validators.required],
    maintenanceHours: ['1', [Validators.required, Validators.min(1)]],
  });

  onSave() {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.maintenanceForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
