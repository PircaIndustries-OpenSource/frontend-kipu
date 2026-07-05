import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RncStore } from '../../application/rnc.store';
import { ProjectStateService } from '../../../shared/application/project-state.service';

@Component({
  selector: 'app-rnc-create-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>New RNC</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <input formControlName="title" placeholder="Title" class="w-full p-2 border mb-2" />
        <textarea
          formControlName="description"
          placeholder="Description"
          class="w-full p-2 border"
        ></textarea>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-dialog-close>Cancel</button>
        <button type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class RncCreateDialogComponent {
  private fb = inject(FormBuilder);
  private store = inject(RncStore);
  private projectService = inject(ProjectStateService);
  private dialogRef = inject(MatDialogRef<RncCreateDialogComponent>);

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    severity: ['Low'],
    status: ['Created'],
  });

  save() {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        projectId: this.projectService.currentProjectId(),
        reportDate: new Date(),
        images: [],
      };
      this.store.create(payload as any);
      this.dialogRef.close();
    }
  }
}
