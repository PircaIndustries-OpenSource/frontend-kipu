import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRipple } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MachineryCatalogEntity } from '../../../../domain/machinery.entity';

@Component({
  selector: 'app-machinery-catalog-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRipple,
    TranslatePipe,
    MatIcon,
  ],
  templateUrl: './machinery-catalog-dialog.html',
})
export class MachineryCatalogDialog {
  data = inject<{ mode: 'create' | 'edit'; item?: MachineryCatalogEntity }>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<MachineryCatalogDialog>);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [this.data.item?.name || '', Validators.required],
    brand: [this.data.item?.brand || ''],
    model: [this.data.item?.model || ''],
    serialNumber: [this.data.item?.serialNumber || ''],
    acquisitionDate: [this.data.item?.acquisitionDate || ''],
  });

  isEdit = this.data.mode === 'edit';
  title = this.isEdit ? 'catalog.machinery-catalog.dialog.edit-title' : 'catalog.machinery-catalog.dialog.create-title';

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    if (value.acquisitionDate && typeof value.acquisitionDate === 'object') {
      value.acquisitionDate = value.acquisitionDate.toISOString().split('T')[0];
    }
    this.dialogRef.close(value);
  }

  close() {
    this.dialogRef.close();
  }
}
