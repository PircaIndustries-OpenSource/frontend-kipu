import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectsStore } from '../../../application/projects.store';

@Component({
  selector: 'app-change-project-status-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './change-project-status-dialog.component.html',
})
export class ChangeProjectStatusDialogComponent {
  private fb = inject(FormBuilder);
  private projectsStore = inject(ProjectsStore);
  private dialogRef = inject(MatDialogRef<ChangeProjectStatusDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  statusForm = this.fb.group({
    // If the project is not currently paused, map its default form option state to 'ACTIVE'
    status: [this.data.project.status === 'ON_HOLD' ? 'ON_HOLD' : 'ACTIVE', Validators.required],
    statusJustification: [this.data.project.statusJustification || ''],
  });

  constructor() {
    this.statusForm.get('status')?.valueChanges.subscribe((status) => {
      const justificationControl = this.statusForm.get('statusJustification');
      if (status === 'ON_HOLD') {
        justificationControl?.setValidators([Validators.required]);
      } else {
        justificationControl?.clearValidators();
      }
      justificationControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const { status, statusJustification } = this.statusForm.value;

    // If user sets it to 'ACTIVE', we clear the status so the main component's reactive loop recalculates its base status dynamically
    const targetStatus = status === 'ACTIVE' ? 'IN_PROGRESS' : 'ON_HOLD';
    const justification = status === 'ACTIVE' ? '' : (statusJustification ?? undefined);

    this.projectsStore.updateProjectStatus(this.data.project.id, targetStatus, justification);
    this.dialogRef.close();
  }
}
