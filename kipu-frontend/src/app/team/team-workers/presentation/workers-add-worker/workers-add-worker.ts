import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; // Asegúrate de importar esto
import { TranslateModule } from '@ngx-translate/core';
import { MachineryEntity } from '../../../../logistics/domain/machinery.entity';
@Component({
  selector: 'app-workers-add-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './workers-add-worker.html',
})
export class WorkersAddWorker {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WorkersAddWorker>);
  public dialogData = inject<{ machineryList: MachineryEntity[] }>(MAT_DIALOG_DATA);

  workerForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    status: ['activo'],
    assignedTools: [[]],
  });

  onSave() {
    if (this.workerForm.valid) {
      this.dialogRef.close(this.workerForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
