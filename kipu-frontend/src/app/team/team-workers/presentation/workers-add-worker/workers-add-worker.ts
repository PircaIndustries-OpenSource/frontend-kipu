import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-workers-add-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './workers-add-worker.html',
})
export class WorkersAddWorker{
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WorkersAddWorker>);

  workerForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    status: ['activo'],
    assignedTools: this.fb.array([]), // Array dinámico para las herramientas
  });

  get tools(): FormArray {
    return this.workerForm.controls['assignedTools'] as FormArray;
  }

  addTool() {
    this.tools.push(this.fb.control('', Validators.required));
  }

  removeTool(index: number) {
    this.tools.removeAt(index);
  }

  onSave() {
    if (this.workerForm.valid) {
      this.dialogRef.close(this.workerForm.value);
    }
  }
  onSubmit(){
    if (this.workerForm.valid) {
      this.dialogRef.close(this.workerForm.value);
    }
  }
  onCancel() {
    this.dialogRef.close()
  }
}
