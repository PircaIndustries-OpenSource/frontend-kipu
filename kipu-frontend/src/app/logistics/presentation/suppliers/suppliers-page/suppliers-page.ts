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
  imports: [SummaryCard, TranslatePipe, SupplierList, MatIcon, MatRipple, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './suppliers-page.html',
  styleUrl: './suppliers-page.css',
})
export class SuppliersPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  private dialog = inject(MatDialog);

  suppliers = this.logisticsStore.suppliers;
  suppliersActive = this.logisticsStore.numberSuppliersActive();
  searchRuc = signal('');

  filteredSuppliers = computed(() => {
    const ruc = this.searchRuc().trim();
    const all = this.suppliers();
    if (!ruc) return all;
    return all.filter((s) => s.ruc.includes(ruc));
  });

  ngOnInit() {
    this.logisticsStore.loadSuppliers();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(SupplierCreateForm, {
      width: '550px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const supplier: SupplierEntity = {
          ...new SupplierEntity(),
          ...result,
        };
        this.logisticsStore.addSupplier(supplier);
      }
    });
  }
}
