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
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';

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
  teamUsersStore = inject(TeamUsersStore);

  canCreateSupplier = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Administrador' || role === 'Logística';
  });

  suppliers = this.logisticsStore.filteredSuppliers;
  suppliersActive = computed(() => {
    return this.logisticsStore.numberSuppliersActive();
  });
  supplierInactive = computed(() => {
    return this.logisticsStore.numberSuppliersInactive();
  });

  ngOnInit() {
    this.logisticsStore.loadSuppliers();
    this.logisticsStore.loadMaterials();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(SupplierCreateForm, {
      width: '650px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const supplier = {
          ruc: result.supplier.ruc,
          socialReason: result.supplier.socialReason,
          contact: result.supplier.contact,
          phone: result.supplier.phone,
          email: result.supplier.email,
          isActive: result.supplier.isActive,
        } as unknown as SupplierEntity;
        this.logisticsStore.addSupplier(supplier, (newSupplier) => {
          result.offers.forEach((offer: { materialId: string; unitPrice: number }) => {
            this.logisticsStore.addSupplierOffer({
              supplierId: newSupplier.id,
              materialId: offer.materialId,
              unitPrice: offer.unitPrice,
            }).subscribe();
          });
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
