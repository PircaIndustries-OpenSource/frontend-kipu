import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { AuthStore } from '../../../../identity/application/auth.store';
import { AutocompleteFilterList } from '../../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';

@Component({
  selector: 'app-waste-report-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    TranslatePipe,
    AutocompleteFilterList,
  ],
  templateUrl: './waste-report-form.html',
})
export class WasteReportForm implements OnInit {
  authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WasteReportForm>);
  logisticsStore = inject(LogisticsStore);

  materials = this.logisticsStore.inventoryView;
  nameMaterials = computed<string[]>(() =>
    this.materials().map((material) => material.materialName),
  );
  ngOnInit() {
    this.logisticsStore.loadInventoryMaterials();
    this.logisticsStore.loadMaterials();
  }
  selectedInventoryMaterial = computed(() => {
    return this.logisticsStore.getInventoryMaterialSelected();
  });
  selectedUnit = computed(() => this.selectedInventoryMaterial()?.materialUnit);
  onInventoryMaterialSelect(materialName: string) {
    this.logisticsStore.setInventorySelectedMaterial(materialName);
    const material = this.selectedInventoryMaterial();
    this.wasteForm.get('materialId')?.setValue(material?.materialId ?? '');
  }
  wasteForm: FormGroup = this.fb.group({
    materialId: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    description: ['', Validators.required],
  });
  onSave() {
    if (this.wasteForm.invalid) {
      this.wasteForm.markAllAsTouched();
      return;
    }
    const formValue = this.wasteForm;
    this.dialogRef.close({
      ...formValue.value,
      unit: this.selectedUnit() ?? '',
      reportedBy: this.authStore.userName(),
    });
  }
}
