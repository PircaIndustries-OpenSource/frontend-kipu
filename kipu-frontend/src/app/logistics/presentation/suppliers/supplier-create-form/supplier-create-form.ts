import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-create-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './supplier-create-form.html',
})
export class SupplierCreateForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierCreateForm>);

  supplierForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: ['', Validators.required],
    contact: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    /*
    * categories: ['', Validators.required],
    paymentTerms: ['', Validators.required],
    * */
    status: ['active'],
  });
  onSave() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }
    const formValue = this.supplierForm;
    this.dialogRef.close(this.supplierForm.value);
  }
}
