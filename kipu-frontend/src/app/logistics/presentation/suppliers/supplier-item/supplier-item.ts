import { Component, inject, input, computed } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { concat, of, Observable } from 'rxjs';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { LogisticsStore } from '../../../application/logistics.store';
import { ConfirmDialog } from '../../../../shared/presentation/confirm-dialog/confirm-dialog';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';

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
  private teamUsersStore = inject(TeamUsersStore);

  canManageSupplier = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Administrador' || role === 'Logística';
  });

  supplierOffers = computed(() =>
    this.logisticsStore.supplierOffer().filter((o) => o.supplierId === this.supplier().id)
  );

  openDetail() {
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadMaterials();
    import('../supplier-detail-dialog/supplier-detail-dialog').then((m) => {
      this.dialog.open(m.SupplierDetailDialog, {
        width: '650px',
        disableClose: true,
        data: { supplier: this.supplier(), offers: this.supplierOffers() },
      });
    });
  }

  openEdit() {
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadMaterials();
    import('../supplier-edit-dialog/supplier-edit-dialog').then((m) => {
      const dialogRef = this.dialog.open(m.SupplierEditDialog, {
        width: '650px',
        disableClose: true,
        data: { supplier: this.supplier(), offers: this.supplierOffers() },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return;
        this.logisticsStore.updateSupplier(this.supplier().id, result.supplier);

        const oldIds = this.supplierOffers().map((o) => o.id);
        const delete$: Observable<any> = oldIds.length
          ? concat(...oldIds.map((id) => this.logisticsStore.deleteSupplierOffer(id)))
          : of(null);

        delete$.subscribe(() => {
          const newOffers = result.offers || [];
          if (newOffers.length === 0) return;
          const offer$ = newOffers.map((offer: { materialId: string; unitPrice: number }) =>
            this.logisticsStore.addSupplierOffer({
              supplierId: this.supplier().id,
              materialId: offer.materialId,
              unitPrice: offer.unitPrice,
            })
          );
          concat(...offer$).subscribe();
        });
      });
    });
  }
  deleteSupplier() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      disableClose: true,
      data: {
        title: 'suppliers.card.delete.title',
        message: 'suppliers.card.delete.message',
        itemName: this.supplier().socialReason,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.logisticsStore.deleteSupplier(this.supplier().id);
      }
    });
  }
}