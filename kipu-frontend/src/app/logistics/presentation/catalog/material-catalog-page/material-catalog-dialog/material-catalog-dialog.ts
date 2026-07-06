import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatRipple } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { CategoryEntity } from '../../../../domain/category.entity';
import { MaterialEntity } from '../../../../domain/material.entity';

const MEASURE_UNITS = [
  'UNIT', 'PIECE', 'TON', 'METER', 'LINEAR_METER', 'SQUARE_METER',
  'CUBIC_METER', 'LITER', 'GALLON', 'BAG', 'ROLL', 'ROD', 'SHEET', 'BUCKET', 'BOX',
];

@Component({
  selector: 'app-material-catalog-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatRipple,
    TranslatePipe,
    MatIcon,
  ],
  templateUrl: './material-catalog-dialog.html',
})
export class MaterialCatalogDialog {
  data = inject<{ mode: 'create' | 'edit'; material?: MaterialEntity; categories: CategoryEntity[] }>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<MaterialCatalogDialog>);
  private fb = inject(FormBuilder);

  measureUnits = MEASURE_UNITS;

  form: FormGroup = this.fb.group({
    name: [this.data.material?.name || '', Validators.required],
    categoryId: [this.data.material?.categoryId || '', Validators.required],
    measureUnit: [this.data.material?.measureUnit || '', Validators.required],
  });

  isEdit = this.data.mode === 'edit';
  title = this.isEdit ? 'catalog.material-catalog.dialog.edit-title' : 'catalog.material-catalog.dialog.create-title';

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
