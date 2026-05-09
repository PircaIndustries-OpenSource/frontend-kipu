import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { ProjectsStore } from '../../../application/projects.store';
import { ProjectSuccessDialogComponent } from '../project-success-dialog/project-success-dialog.component';

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './create-project-dialog.component.html',
})
export class CreateProjectDialogComponent {
  private fb = inject(FormBuilder);
  private projectsStore = inject(ProjectsStore);
  private dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);
  private dialog = inject(MatDialog);

  projectForm = this.fb.group({
    name: ['', [Validators.required], [this.nameDuplicationValidator()]],
    description: ['', [Validators.required]],
    status: ['PLANNED', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    estimatedBudget: [''],
    location: ['', [Validators.required]],
  });

  nameDuplicationValidator() {
    return (control: AbstractControl): Observable<{ [key: string]: unknown } | null> => {
      if (!control.value) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.projectsStore.checkNameExists(control.value)),
        map((exists) => (exists ? { nameDuplicated: true } : null)),
        catchError(() => of(null)),
      );
    };
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const { name, description, status, startDate, endDate, estimatedBudget, location } = this.projectForm.value;

    const project = {
      id: '',
      name: name ?? '',
      description: description ?? '',
      status: status ?? 'PLANNED',
      startDate: startDate ?? '',
      endDate: endDate ?? undefined,
      estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
      location: location ?? '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'current-user',
    };

    // Assuming the store calls API and handles it internally. 
    // In a real app we might want to wait for the subscription, but the store abstraction doesn't return an observable from addProject.
    // Wait, addProject in store.ts adds to signal asynchronously, so the project gets created.
    this.projectsStore.addProject(project);

    this.dialogRef.close();
    this.dialog.open(ProjectSuccessDialogComponent, {
      width: '400px',
      disableClose: true
    });
  }
}
