import { Component, computed, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-request-modify-dialog',
  imports: [
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatDialogClose,
  ],
  templateUrl: './request-modify-dialog.html',
  styleUrl: './request-modify-dialog.css',
})
export class RequestModifyDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RequestModifyDialog>);
  private data = inject<EnrichedRequest>(MAT_DIALOG_DATA);
  private logisticsStore = inject(LogisticsStore);

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
    const supplierId = this.item()?.supplierOfferId;
    const offer = this.logisticsStore.supplierOffer().find(s => s.id === supplierId);
    const supplier = this.logisticsStore.suppliers().find(s => s.id === offer?.supplierId);
    return supplier?.socialReason ?? '';
  });
  itemId = computed(() => this.data.items[0]?.supplierOfferId ?? '');

  modifyForm: FormGroup = this.fb.group({
    quantity: [this.data.items[0]?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
    priority: [this.data.priority, Validators.required],
    deadline: [this.data.deadline, Validators.required],
    deliveryLocation: [this.data.deliveryLocation, Validators.required],
    purpose: [this.data.purpose, Validators.required],
    additionalNotes: [this.data.additionalNotes],
  });

  ngOnInit() {
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadSuppliers();
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
        quantity: form.quantity,
        id: this.data.items[0]?.supplierOfferId ?? undefined,
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
