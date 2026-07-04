import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-machinery-catalog-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './machinery-catalog-form.html',
})
export class MachineryCatalogForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineryCatalogForm>);

  catalogForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    brand: [''],
    model: [''],
    serialNumber: [''],
    acquisitionDate: [null],
  });

  onSave() {
    if (this.catalogForm.invalid) {
      this.catalogForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.catalogForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
