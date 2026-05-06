import { Component, inject, OnInit } from '@angular/core';
import {MachineryList} from '../machinery-list/machinery-list';
import { LogisticsStore } from '../../../application/logistics.store';
import {TranslatePipe} from '@ngx-translate/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';

@Component({
  selector: 'app-machinery-page',
  imports: [MachineryList, TranslatePipe, SummaryCard],
  templateUrl: './machinery-page.html',
  styleUrl: './machinery-page.css',
})
export class MachineryPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  machinery = this.logisticsStore.machinery;
  ngOnInit() {
    this.logisticsStore.loadMachinery();
  }
}
