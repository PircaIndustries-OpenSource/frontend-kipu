import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-supplier-edit-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslatePipe,
    MatSelect,
    MatOption,
    MatInput,
    MatButton,
  ],
  templateUrl: './supplier-edit-dialog.html',
})
export class SupplierEditDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierEditDialog>);
  data: SupplierEntity = inject(MAT_DIALOG_DATA);

  supplierForm: FormGroup = this.fb.group({
    ruc: [this.data.ruc, [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: [this.data.socialReason, Validators.required],
    contact: [this.data.contact, Validators.required],
    phone: [this.data.phone, Validators.required],
    email: [this.data.email, [Validators.required, Validators.email]],
    /*
    categories: [this.data.categories, Validators.required],
    paymentTerms: [this.data.paymentTerms, Validators.required],
    * */

    status: [this.data.status],
  });

  onSave() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.supplierForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
