import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { TeamWorkersStore } from '../../../../team/team-workers/application/team-workers.store';

@Component({
  selector: 'app-machinery-assign-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    TranslatePipe,
    MatDialogClose,
  ],
  templateUrl: './machinery-assign-dialog.html',
})
export class MachineryAssignDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineryAssignDialog>);
  workersStore = inject(TeamWorkersStore);

  workerList = this.workersStore.teamWorkers;
  assignForm: FormGroup = this.fb.group({
    workerDni: ['', Validators.required],
  });

  ngOnInit() {
    this.workersStore.loadWorkers();
  }

  onAssign() {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }
    const worker = this.workerList().find((w) => w.dni === this.assignForm.value.workerDni);
    this.dialogRef.close({
      workerDni: this.assignForm.value.workerDni,
      workerName: worker?.fullName ?? '',
      workerId: worker?.id ?? '',
    });
  }
}
