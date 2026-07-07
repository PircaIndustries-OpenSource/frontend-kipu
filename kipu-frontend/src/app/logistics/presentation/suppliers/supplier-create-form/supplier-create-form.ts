import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatRipple } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { SupplierOfferEntity } from '../../../domain/supplierOffer.entity';

@Component({
  selector: 'app-supplier-create-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelect,
    MatOption,
    MatRipple,
    TranslatePipe,
  ],
  templateUrl: './supplier-create-form.html',
})
export class SupplierCreateForm {
  data = inject<{ existingOffers?: SupplierOfferEntity[] }>(MAT_DIALOG_DATA, { optional: true });
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierCreateForm>);
  logisticsStore = inject(LogisticsStore);

  materials = computed(() => this.logisticsStore.materials());
  existingOffers: SupplierOfferEntity[] = this.data?.existingOffers || [];

  supplierForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: ['', Validators.required],
    contact: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{7,15}$')]],
    email: ['', [Validators.required, Validators.email]],
    isActive: [true],
    offers: this.fb.array([]),
  });

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
}
