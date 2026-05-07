import { Component, inject, OnInit } from '@angular/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { WasteList } from '../waste-list/waste-list';
import {TranslatePipe} from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { SupplierList } from '../../suppliers/supplier-list/supplier-list';

@Component({
  selector: 'app-waste-page',
  imports: [WasteList, TranslatePipe, MatIcon, MatRipple, SummaryCard, SupplierList],
  templateUrl: './waste-page.html',
  styleUrl: './waste-page.css',
})
export class WastePage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  waste = this.logisticsStore.waste;
  ngOnInit() {
    this.logisticsStore.loadWaste();
  }
}
