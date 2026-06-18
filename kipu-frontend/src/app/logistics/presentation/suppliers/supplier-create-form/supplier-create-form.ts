import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { MatOption } from '@angular/material/core';
import { DecimalPipe } from '@angular/common';

export interface MaterialOffer {
  materialId: string;
  materialName: string;
  unitPrice: number;
}

@Component({
  selector: 'app-supplier-create-form',
  standalone: true,
  imports: [
    MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule, TranslatePipe, MatOption,
    DecimalPipe,
  ],
  templateUrl: './supplier-create-form.html',
})
export class SupplierCreateForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierCreateForm>);
  private logisticsStore = inject(LogisticsStore);

  materials = computed(() => this.logisticsStore.filteredMaterials());
  nameMaterials = computed(() => this.materials().map(m => m.name));
  materialOffers = signal<MaterialOffer[]>([]);

  selectedMaterialName = '';
  selectedUnitPrice = 0;

  ngOnInit() {
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadCategories();
  }

  supplierForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: ['', Validators.required],
    contact: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    status: ['ACTIVE'],
  });

  addMaterial() {
    if (!this.selectedMaterialName || !this.selectedUnitPrice || this.selectedUnitPrice <= 0) return;
    const mat = this.materials().find(m => m.name === this.selectedMaterialName);
    if (!mat) return;
    if (this.materialOffers().some(o => String(o.materialId) === String(mat.id))) return;
    this.materialOffers.update(list => [...list, {
      materialId: String(mat.id),
      materialName: mat.name,
      unitPrice: this.selectedUnitPrice,
    }]);
    this.selectedMaterialName = '';
    this.selectedUnitPrice = 0;
  }

  removeMaterial(materialId: string) {
    this.materialOffers.update(list => list.filter(o => o.materialId !== materialId));
  }

  onSave() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close({
      supplier: this.supplierForm.value,
      offers: this.materialOffers(),
    });
  }
}
