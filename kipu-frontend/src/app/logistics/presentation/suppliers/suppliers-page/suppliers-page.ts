import { Component, inject, OnInit } from '@angular/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import {TranslatePipe} from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { SupplierList } from '../supplier-list/supplier-list';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-suppliers-page',
  imports: [SummaryCard, TranslatePipe, SupplierList, MatIcon, MatRipple],
  templateUrl: './suppliers-page.html',
  styleUrl: './suppliers-page.css',
})
export class SuppliersPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  suppliers = this.logisticsStore.suppliers;
  suppliersActive = this.logisticsStore.numberSuppliersActive();
  ngOnInit() {
    this.logisticsStore.loadSuppliers();
  }
}
