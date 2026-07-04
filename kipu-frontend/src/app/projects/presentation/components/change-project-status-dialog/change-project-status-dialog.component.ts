import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
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
    TranslateModule
  ],
  templateUrl: './change-project-status-dialog.component.html'
})
export class ChangeProjectStatusDialogComponent {
  private fb = inject(FormBuilder);
  private projectsStore = inject(ProjectsStore);
  private dialogRef = inject(MatDialogRef<ChangeProjectStatusDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  statusForm = this.fb.group({
    status: [this.data.project.status, Validators.required],
    statusJustification: ['', Validators.required]
  });

  constructor() {}

  onSubmit() {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const { status, statusJustification } = this.statusForm.value;
    
    this.projectsStore.updateProjectStatus(this.data.project.id, status!, statusJustification ?? undefined);
    this.dialogRef.close();
  }
}
