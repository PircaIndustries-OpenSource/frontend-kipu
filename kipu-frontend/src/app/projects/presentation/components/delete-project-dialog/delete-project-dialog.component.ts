import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProjectsStore } from '../../../application/projects.store';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './delete-project-dialog.component.html',
})
export class DeleteProjectDialogComponent {
  dialogRef = inject(MatDialogRef<DeleteProjectDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  projectsStore = inject(ProjectsStore);

  confirmationText = '';

  onDelete() {
    if (this.confirmationText === this.data.project.name) {
      this.projectsStore.deleteProject(this.data.project.id);
      this.dialogRef.close(true);
    }
  }
}
