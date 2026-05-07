import { Component, computed, inject, OnInit } from '@angular/core';
import {RequestList} from '../request-list/request-list';
import {LogisticsStore} from '../../../application/logistics.store';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import {TranslatePipe} from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import {BudgetStore} from '../../../../budget/application/budget-store';

@Component({
  selector: 'app-request-page',
  imports: [RequestList, SummaryCard, TranslatePipe, MatIcon, MatRipple],
  templateUrl: './request-page.html',
  styleUrl: './request-page.css',
})
export class RequestPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);
  requests = this.logisticsStore.requestFiltered;
  availableBudget = this.budgetStore.totalAvailable;
  totalBudget = this.budgetStore.totalBudgeted;
  ngOnInit() {
    this.logisticsStore.loadRequest();
  }
  onFilterChange(filter: string) {
    this.logisticsStore.filterRequest(filter);
  }
}
