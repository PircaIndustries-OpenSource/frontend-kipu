import { Component, inject, input } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';
import { SupplierEditDialog } from '../supplier-edit-dialog/supplier-edit-dialog';
import { LogisticsStore } from '../../../application/logistics.store';

@Component({
  selector: 'app-supplier-item',
  imports: [MatCard, MatCardActions, MatCardContent, TranslatePipe],
  templateUrl: './supplier-item.html',
})
export class SupplierItem {
  supplier = input.required<SupplierEntity>();
  private dialog = inject(MatDialog);
  private logisticsStore = inject(LogisticsStore);

  openEdit() {
    const dialogRef = this.dialog.open(SupplierEditDialog, {
      width: '550px',
      disableClose: true,
      data: this.supplier(),
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logisticsStore.updateSupplier(this.supplier().id, result);
      }
    });
  }
}
