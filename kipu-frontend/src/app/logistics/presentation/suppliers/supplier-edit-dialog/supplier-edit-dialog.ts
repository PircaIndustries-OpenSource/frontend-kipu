import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { SupplierOfferEntity } from '../../../domain/supplierOffer.entity';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { LogisticsStore } from '../../../application/logistics.store';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-supplier-edit-dialog',
  imports: [
    MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule,
    TranslatePipe, MatSelect, MatOption, MatInput, MatButton, DecimalPipe,
  ],
  templateUrl: './supplier-edit-dialog.html',
})
export class SupplierEditDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierEditDialog>);
  private logisticsStore = inject(LogisticsStore);
  data: SupplierEntity = inject(MAT_DIALOG_DATA);

  materials = computed(() => this.logisticsStore.filteredMaterials());
  nameMaterials = computed(() => this.materials().map(m => m.name));
  existingOffers = signal<SupplierOfferEntity[]>([]);
  newOffers = signal<{ materialId: string; materialName: string; unitPrice: number }[]>([]);
  removedOfferIds = signal<string[]>([]);

  selectedMaterialName = '';
  selectedUnitPrice = 0;

  supplierForm: FormGroup = this.fb.group({
    ruc: [this.data.ruc, [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: [this.data.socialReason, Validators.required],
    contact: [this.data.contact, Validators.required],
    phone: [this.data.phone, Validators.required],
    email: [this.data.email, [Validators.required, Validators.email]],
    status: [this.data.status],
  });

  ngOnInit() {
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadCategories();
    this.logisticsStore.getSupplierOffers(this.data.id).subscribe(offers => {
      this.existingOffers.set(offers);
    });
  }

  getOfferMaterialName(offer: SupplierOfferEntity): string {
    const mat = this.materials().find(m => String(m.id) === String(offer.materialId));
    return mat?.name ?? ('Material #' + offer.materialId);
  }

  addMaterial() {
    if (!this.selectedMaterialName || !this.selectedUnitPrice || this.selectedUnitPrice <= 0) return;
    const mat = this.materials().find(m => m.name === this.selectedMaterialName);
    if (!mat) return;
    const matId = String(mat.id);
    if (this.existingOffers().some(o => String(o.materialId) === matId)) return;
    if (this.newOffers().some(o => String(o.materialId) === matId)) return;
    this.newOffers.update(list => [...list, {
      materialId: matId,
      materialName: mat.name,
      unitPrice: this.selectedUnitPrice,
    }]);
    this.selectedMaterialName = '';
    this.selectedUnitPrice = 0;
  }

  removeNewOffer(materialId: string) {
    this.newOffers.update(list => list.filter(o => String(o.materialId) !== String(materialId)));
  }

  removeExistingOffer(offerId: string) {
    this.removedOfferIds.update(list => [...list, String(offerId)]);
    this.existingOffers.update(list => list.filter(o => String(o.id) !== String(offerId)));
  }

  onSave() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      supplier: this.supplierForm.value,
      newOffers: this.newOffers(),
      removedOfferIds: this.removedOfferIds(),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
