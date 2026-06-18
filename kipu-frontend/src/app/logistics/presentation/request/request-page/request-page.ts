import { Component, computed, inject, OnInit } from '@angular/core';
import { RequestList } from '../request-list/request-list';
import { LogisticsStore } from '../../../application/logistics.store';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { BudgetStore } from '../../../../budget/application/budget-store';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-page',
  imports: [RequestList, SummaryCard, TranslatePipe, MatIcon, MatRipple, RouterModule],
  templateUrl: './request-page.html',
  styleUrl: './request-page.css',
})
export class RequestPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);
  requests = this.logisticsStore.requestFiltered;
  availableBudget = this.budgetStore.totalAvailable;
  totalBudget = this.budgetStore.totalBudgeted;
  pendingCount = computed(() => this.logisticsStore.requestDetailsView().filter(r => r.status === 'PENDING').length);
  approvedCount = computed(() => this.logisticsStore.requestDetailsView().filter(r => r.status === 'ACCEPTED').length);
  refusedCount = computed(() => this.logisticsStore.requestDetailsView().filter(r => r.status === 'REFUSED').length);

  ngOnInit() {
    this.logisticsStore.loadRequest();
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadCategories();
    this.budgetStore.loadBudgetItems();
  }
  onFilterChange(filter: string) {
    this.logisticsStore.filterRequest(filter);
  }
  router = inject(Router);
  goToCreatePage() {
    this.router.navigate(['/logistics/request/create']).then();
  }
  readonly pendingIsActive = this.logisticsStore.pendingRequestFilter;
  readonly approvedIsActive = this.logisticsStore.approvedRequestFilter;
  readonly refusedIsActive = this.logisticsStore.refusedRequestFilter;

  togglePendingIsActive() {
    this.logisticsStore.togglePendingRequestFilter();
  }
  toggleApprovedIsActive() {
    this.logisticsStore.toggleApprovedRequestFilter();
  }
  toggleRefusedIsActive() {
    this.logisticsStore.toggleRefusedRequestFilter();
  }
}
