import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProjectsStore } from '../../../application/projects.store';

@Component({
  selector: 'app-select-project-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './select-project-dialog.component.html',
})
export class SelectProjectDialogComponent {
  private dialogRef = inject(MatDialogRef<SelectProjectDialogComponent>);
  private projectsStore = inject(ProjectsStore);
  public data = inject(MAT_DIALOG_DATA);

  onConfirm() {
    this.projectsStore.setCurrentProject(this.data.project.id);
    this.dialogRef.close(true);
  }
}
