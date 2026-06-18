import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { SupplierList } from '../supplier-list/supplier-list';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SupplierCreateForm } from '../supplier-create-form/supplier-create-form';
import { SupplierEntity } from '../../../domain/supplier.entity';

@Component({
  selector: 'app-suppliers-page',
  imports: [
    SummaryCard,
    TranslatePipe,
    SupplierList,
    MatIcon,
    MatRipple,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './suppliers-page.html',
  styleUrl: './suppliers-page.css',
})
export class SuppliersPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  private dialog = inject(MatDialog);

  suppliers = this.logisticsStore.filteredSuppliers;
  suppliersActive = computed(() => {
    return this.logisticsStore.numberSuppliersActive();
  });
  supplierInactive = computed(() => {
    return this.logisticsStore.numberSuppliersInactive();
  });

  ngOnInit() {
    this.logisticsStore.loadSuppliers();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(SupplierCreateForm, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const supplier: SupplierEntity = {
          ...new SupplierEntity(),
          ...result.supplier,
        };
        this.logisticsStore.addSupplier(supplier, () => {
          const newId = this.logisticsStore.suppliersSignal().at(-1)?.id;
          if (newId && result.offers?.length) {
            for (const offer of result.offers) {
              this.logisticsStore.addSupplierOffer({
                supplierId: Number(newId),
                materialCatalogId: Number(offer.materialId),
                unitPrice: offer.unitPrice,
              });
            }
          }
        });
      }
    });
  }
  readonly searchRuc = this.logisticsStore.searchRuc;
  onSearchRucChange(value: string) {
    this.searchRuc.set(value);
  }
  readonly activeSupplierFilter = this.logisticsStore.activeSupplierFilter;
  readonly inactiveSupplierFilter = this.logisticsStore.inactiveSupplierFilter;
  toggleActiveSupplierFilter() {
    this.logisticsStore.toggleActiveSupplierFilter();
  }
  toggleInactiveSupplierFilter() {
    this.logisticsStore.toggleInactiveSupplierFilter();
  }
}
