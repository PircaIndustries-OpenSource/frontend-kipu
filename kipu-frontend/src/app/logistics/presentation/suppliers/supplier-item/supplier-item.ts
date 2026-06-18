import { Component, inject, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { SupplierEditDialog } from '../supplier-edit-dialog/supplier-edit-dialog';
import { LogisticsStore } from '../../../application/logistics.store';
import { ConfirmDialog } from '../../../../shared/presentation/confirm-dialog/confirm-dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-supplier-item',
  imports: [MatCard, MatCardActions, MatCardContent, TranslatePipe, CommonModule, MatIconModule, MatRipple],
  templateUrl: './supplier-item.html',
  styleUrl: './supplier-item.css'
})
export class SupplierItem {
  supplier = input.required<SupplierEntity>();
  private dialog = inject(MatDialog);
  private logisticsStore = inject(LogisticsStore);

  openEdit() {
    const dialogRef = this.dialog.open(SupplierEditDialog, {
      width: '600px',
      disableClose: true,
      data: this.supplier(),
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logisticsStore.updateSupplier(this.supplier().id, result.supplier, () => {
          const supplierId = String(this.supplier().id);
          for (const id of result.removedOfferIds) {
            this.logisticsStore.removeSupplierOffer(String(id));
          }
          if (result.newOffers?.length) {
            let completed = 0;
            const total = result.newOffers.length;
            const checkDone = () => {
              completed++;
              if (completed >= total) {
                this.logisticsStore.loadSupplierOffers(true);
              }
            };
            for (const offer of result.newOffers) {
              this.logisticsStore.addSupplierOffer({
                supplierId: Number(supplierId),
                materialCatalogId: Number(offer.materialId),
                unitPrice: offer.unitPrice,
              }, checkDone, checkDone);
            }
          }
        });
      }
    });
  }
  deleteSupplier() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'suppliers.card.delete.title',
        subtitle: 'suppliers.card.delete.subtitle',
        confirmText: 'suppliers.card.delete.confirm',
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.logisticsStore.deleteSupplier(this.supplier().id);
      }
    });
  }
}
