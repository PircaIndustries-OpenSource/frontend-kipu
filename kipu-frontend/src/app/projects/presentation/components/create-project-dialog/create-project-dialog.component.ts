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
import { SuccessDialog } from '../../../../shared/presentation/success-dialog/success-dialog';
import { UploadService } from '../../../../shared/infrastructure/upload.service';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

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
    MatDialogModule,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './create-project-dialog.component.html',
})
export class CreateProjectDialogComponent {
  private fb = inject(FormBuilder);
  private projectsStore = inject(ProjectsStore);
  private dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);
  private dialog = inject(MatDialog);
  private uploadService = inject(UploadService);

  selectedFile: File | null = null;
  selectedFileName = '';
  isUploading = false;
  uploadedImageUrl: string | null = null;

  projectForm = this.fb.group({
    name: ['', [Validators.required], [this.nameDuplicationValidator()]],
    description: ['', [Validators.required]],
    status: ['PLANNED', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    estimatedBudget: [''],
    location: ['', [Validators.required]],
  });

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

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

    if (this.selectedFile) {
      this.isUploading = true;
      this.uploadService.uploadFile(this.selectedFile).subscribe({
        next: (url) => {
          this.uploadedImageUrl = url;
          this.isUploading = false;
          this.finalizeSubmit();
        },
        error: () => {
          this.isUploading = false;
          this.finalizeSubmit(); // continue with default image if upload fails
        }
      });
    } else {
      this.finalizeSubmit();
    }
  }

  private finalizeSubmit() {
    const { name, description, status, startDate, endDate, estimatedBudget, location } =
      this.projectForm.value;

    const placeholderImages = [
      'project-image1.png',
      'project-image2.png',
      'project-image3.png',
      'project-image4.png',
      'project-image5.png',
    ];
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    const imageUrl = this.uploadedImageUrl || randomImage;

    const project = {
      id: '',
      name: name ?? '',
      description: description ?? '',
      status: status ?? 'PLANNED',
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      totalBudget: estimatedBudget ? Number(estimatedBudget) : 0,
      location: location ?? '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: '', // Store will assign this automatically
      imageUrl: imageUrl,
    };

    this.projectsStore.addProject(project);

    this.dialogRef.close();
    this.dialog.open(SuccessDialog, {
      width: '400px',
      disableClose: true,
      data: {
        title: '¡Proyecto Creado!',
        subtitle: 'El nuevo proyecto ha sido registrado y está listo para ser gestionado.',
        textButton: 'Entendido',
      },
    });
  }
}

