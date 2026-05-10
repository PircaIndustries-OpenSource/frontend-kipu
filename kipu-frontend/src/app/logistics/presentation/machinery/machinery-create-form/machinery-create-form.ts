import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { TeamWorkersStore } from '../../../../team/team-workers/application/team-workers.store';

@Component({
  selector: 'app-machinery-create-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './machinery-create-form.html',
})
export class MachineryCreateForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineryCreateForm>);
  workersStore = inject(TeamWorkersStore);

  workerList = this.workersStore.teamWorkers;

  machineryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    assignedTo: [''],
    assignmentDetail: ['', Validators.required],
  });

  ngOnInit() {
    this.workersStore.loadWorkers();
  }

  onSave() {
    if (this.machineryForm.invalid) {
      this.machineryForm.markAllAsTouched();
      return;
    }
    const formValue = this.machineryForm.value;
    const worker = this.workerList().find((w) => w.dni === formValue.assignedTo);
    this.dialogRef.close({
      ...formValue,
      assignedTo: worker ? `${worker.dni} - ${worker.fullName}` : formValue.assignedTo,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
