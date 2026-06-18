import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LogisticsStore } from '../../../../application/logistics.store';
import { EnrichedRequest } from '../../../../application/logistics.store';
import { BudgetStore } from '../../../../../budget/application/budget-store';
import { DecimalPipe, NgClass, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-request-modify-dialog',
  imports: [
    MatButton, MatDatepicker, MatDatepickerInput, MatDatepickerToggle,
    MatDialogActions, MatDialogContent, MatDialogTitle, MatError,
    MatInput, MatLabel, MatOption, MatSelect, MatSuffix,
    ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatDialogClose,
    DecimalPipe, NgClass, DatePipe, MatIcon,
  ],
  templateUrl: './request-modify-dialog.html',
  styleUrl: './request-modify-dialog.css',
})
export class RequestModifyDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RequestModifyDialog>);
  protected data = inject<EnrichedRequest>(MAT_DIALOG_DATA);
  protected logisticsStore = inject(LogisticsStore);
  protected budgetStore = inject(BudgetStore);

  measureUnitLabels: Record<string, string> = {
    UNIT: 'und', PIECE: 'pza', TON: 'ton', METER: 'm',
    LINEAR_METER: 'ml', SQUARE_METER: 'm2', CUBIC_METER: 'm3',
    LITER: 'l', GALLON: 'gal', BAG: 'bol', ROLL: 'rll',
    ROD: 'var', SHEET: 'plan', BUCKET: 'bal', BOX: 'cja',
  };

  item = computed(() => this.data.items[0]);

  materialName = computed(() => this.item()?.materialName ?? '');
  categoryName = computed(() => this.item()?.categoryName ?? '');
  measureUnit = computed(() => {
    const unit = this.item()?.materialUnit;
    return unit ? this.measureUnitLabels[unit] || unit : '';
  });
  supplierName = computed(() => {
    const sid = this.item()?.supplierId;
    const supplier = this.logisticsStore.suppliers().find(s => String(s.id) === String(sid));
    return supplier?.socialReason ?? ('Proveedor #' + sid);
  });
  unitPrice = computed(() => this.item()?.pricePerUnit ?? 0);
  quantitySignal = signal(this.data.items[0]?.quantity ?? 1);
  requestedAmount = computed(() => Math.ceil(this.quantitySignal() * this.unitPrice()));

  private budgetItemsSig = signal<any[]>([]);

  budgetLineName = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 'Sin asignar';
    const items = this.budgetItemsSig();
    const match = items.find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.name ?? ('Linea #' + blId);
  });

  assignedBudget = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 0;
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.budgeted ?? 0;
  });
  executedAmount = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 0;
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.executed ?? 0;
  });
  availableAmount = computed(() => {
    const blId = this.data.budgetLineId;
    if (!blId) return 0;
    const match = this.budgetItemsSig().find((b: any) => String(b.id) === String(blId) || b.name === blId);
    return match?.available ?? 0;
  });
  isOverBudget = computed(() => this.requestedAmount() > this.availableAmount());

  suppliers = computed(() => this.logisticsStore.suppliers());
  nameSuppliers = computed(() => this.suppliers().map(s => s.socialReason));

  modifyForm: FormGroup = this.fb.group({
    quantity: [this.data.items[0]?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
    priority: [this.data.priority, Validators.required],
    deadline: [this.data.deadline, Validators.required],
    deliveryLocation: [this.data.deliveryLocation, Validators.required],
    purpose: [this.data.purpose, Validators.required],
    additionalNotes: [this.data.additionalNotes],
    suggestedSupplier: [this.supplierName()],
  });

  constructor() {
    effect(() => {
      const suppliers = this.logisticsStore.suppliers();
      const name = this.supplierName();
      if (suppliers.length > 0 && name && !name.startsWith('Proveedor #')) {
        this.modifyForm?.get('suggestedSupplier')?.setValue(name, { emitEvent: false });
      }
    });
    effect(() => {
      const items = this.budgetStore.budgetItems();
      if (items.length > 0) {
        this.budgetItemsSig.set(items);
      }
    });
  }

  ngOnInit() {
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadSuppliers();
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadCategories();
    this.budgetStore.loadBudgetItems();
    this.modifyForm.get('quantity')?.valueChanges.subscribe((val) => {
      this.quantitySignal.set(val ?? 1);
    });
  }

  onSave() {
    if (this.modifyForm.invalid) {
      this.modifyForm.markAllAsTouched();
      return;
    }
    const form = this.modifyForm.value;
    this.dialogRef.close({
      items: [{
        supplierOfferId: this.data.items[0]?.supplierOfferId ?? '',
        materialCatalogId: this.data.items[0]?.materialCatalogId ?? '',
        supplierId: this.data.items[0]?.supplierId ?? '',
        quantity: form.quantity,
        unitPrice: this.unitPrice(),
      }],
      priority: form.priority,
      deadline: form.deadline,
      deliveryLocation: form.deliveryLocation,
      purpose: form.purpose,
      additionalNotes: form.additionalNotes,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d !== null && d >= today;
  };
}
