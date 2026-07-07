import { Component, inject, OnInit, computed } from '@angular/core';
import { RequestList } from '../request-list/request-list';
import { LogisticsStore } from '../../../application/logistics.store';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { BudgetStore } from '../../../../budget/application/budget-store';
import { Router, RouterModule } from '@angular/router';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';

@Component({
  selector: 'app-request-page',
  imports: [RequestList, SummaryCard, TranslatePipe, MatIcon, MatRipple, RouterModule],
  templateUrl: './request-page.html',
  styleUrl: './request-page.css',
})
export class RequestPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);
  teamUsersStore = inject(TeamUsersStore);
  requests = this.logisticsStore.requestFiltered;
  availableBudget = this.budgetStore.totalAvailable;
  totalBudget = this.budgetStore.totalBudgeted;
  isLogistica = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Logística' || role === 'Administrador' || role === 'ROLE_ADMIN';
  });
  canCreateRequest = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role !== 'Logística';
  });
  ngOnInit() {
    this.budgetStore.loadBudgetItems();
    this.logisticsStore.loadRequest();
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadCategories();
    const projectId = localStorage.getItem('currentProjectId');
    if (projectId) {
      this.teamUsersStore.loadTeamUsers(projectId);
    }
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
  readonly pendingCount = this.logisticsStore.pendingRequestsCount;
  readonly acceptedCount = this.logisticsStore.acceptedRequestsCount;
  readonly refusedCount = this.logisticsStore.refusedRequestsCount;

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
