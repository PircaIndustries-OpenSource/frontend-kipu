import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRipple } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { CategoryEntity } from '../../../../domain/category.entity';

@Component({
  selector: 'app-category-catalog-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRipple,
    MatSlideToggleModule,
    TranslatePipe,
    MatIcon,
  ],
  templateUrl: './category-catalog-dialog.html',
})
export class CategoryCatalogDialog {
  data = inject<{ mode: 'create' | 'edit'; category?: CategoryEntity }>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<CategoryCatalogDialog>);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [this.data.category?.name || '', Validators.required],
    description: [this.data.category?.description || ''],
    isActive: [this.data.category?.isActive ?? true],
  });

  isEdit = this.data.mode === 'edit';
  title = this.isEdit ? 'catalog.category-catalog.dialog.edit-title' : 'catalog.category-catalog.dialog.create-title';

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
