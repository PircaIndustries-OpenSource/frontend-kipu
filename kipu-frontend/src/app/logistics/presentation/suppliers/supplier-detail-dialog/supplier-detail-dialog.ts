import { Component, computed, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LogisticsStore } from '../../../application/logistics.store';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { SupplierOfferEntity } from '../../../domain/supplierOffer.entity';

@Component({
  selector: 'app-supplier-detail-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    TranslatePipe,
    CommonModule,
    DecimalPipe,
  ],
  templateUrl: './supplier-detail-dialog.html',
})
export class SupplierDetailDialog {
  data: { supplier: SupplierEntity; offers: SupplierOfferEntity[] } = inject(MAT_DIALOG_DATA);
  logisticsStore = inject(LogisticsStore);
  private dialogRef = inject(MatDialogRef<SupplierDetailDialog>);

  materials = computed(() => this.logisticsStore.materials());

  materialName(materialId: string): string {
    const mat = this.materials().find((m) => m.id === materialId);
    return mat?.name || materialId;
  }

  onClose() {
    this.dialogRef.close();
  }
}
