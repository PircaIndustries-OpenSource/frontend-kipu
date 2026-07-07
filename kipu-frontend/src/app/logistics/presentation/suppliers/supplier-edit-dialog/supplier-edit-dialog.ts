import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRipple } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { SupplierOfferEntity } from '../../../domain/supplierOffer.entity';

@Component({
  selector: 'app-supplier-edit-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslatePipe,
    MatSelect,
    MatOption,
    MatInputModule,
    MatRipple,
  ],
  templateUrl: './supplier-edit-dialog.html',
})
export class SupplierEditDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierEditDialog>);
  data: { supplier: SupplierEntity; offers: SupplierOfferEntity[] } = inject(MAT_DIALOG_DATA);
  logisticsStore = inject(LogisticsStore);

  materials = computed(() => this.logisticsStore.materials());

  supplierForm: FormGroup = this.fb.group({
    ruc: [this.data.supplier.ruc, [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: [this.data.supplier.socialReason, Validators.required],
    contact: [this.data.supplier.contact, Validators.required],
    phone: [this.data.supplier.phone, Validators.required],
    email: [this.data.supplier.email, [Validators.required, Validators.email]],
    isActive: [this.data.supplier.isActive],
    offers: this.fb.array([]),
  });

  constructor() {
    const existing = this.data.offers || [];
    existing.forEach((offer) => {
      this.offers.push(this.fb.group({
        materialId: [offer.materialId, Validators.required],
        unitPrice: [offer.unitPrice, [Validators.required, Validators.min(0.01)]],
      }));
    });
  }

  get offers(): FormArray {
    return this.supplierForm.get('offers') as FormArray;
  }

  addOffer() {
    this.offers.push(this.fb.group({
      materialId: ['', Validators.required],
      unitPrice: ['', [Validators.required, Validators.min(0.01)]],
    }));
  }

  removeOffer(index: number) {
    this.offers.removeAt(index);
  }

  getRemainingMaterials(index: number) {
    const selectedIds = this.offers.controls
      .filter((_, i) => i !== index)
      .map((c) => c.get('materialId')?.value)
      .filter(Boolean);
    return this.materials().filter((m) => !selectedIds.includes(m.id));
  }

  onSave() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }
    const value = this.supplierForm.value;
    this.dialogRef.close({
      supplier: {
        ruc: value.ruc,
        socialReason: value.socialReason,
        contact: value.contact,
        phone: value.phone,
        email: value.email,
        isActive: value.isActive,
      },
      offers: value.offers || [],
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
