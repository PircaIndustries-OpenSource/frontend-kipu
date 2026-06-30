import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { BudgetItemEntity } from '../domain/budget-item.entity';
import { ProjectsStore } from '../../projects/application/projects.store';
import { BudgetApi } from '../infrastructure/budget-api';
import { BudgetAssembler } from '../infrastructure/budget-assembler';
import { ProgressStore } from '../../progress/application/progress.store';
import { ProjectProgress } from '../../progress/domain/progress.entity';
import { TeamUsersStore } from '../../team/team-users/application/team-users.store';
import { TeamUsersEntity } from '../../team/team-users/domain/model/team-users.entity';

@Injectable({
  providedIn: 'root',
})
export class BudgetStore {
  // Dependencies
  private readonly budgetApi = inject(BudgetApi);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly progressStore = inject(ProgressStore);
  private readonly teamUsersStore = inject(TeamUsersStore);

  // State signals
  private readonly budgetItemsSignal = signal<BudgetItemEntity[]>([]);
  private readonly searchQuery = signal<string>('');
  readonly selectedItem = signal<BudgetItemEntity | null>(null);

  constructor() {
    effect(() => {
      const activeId = this.projectsStore.currentProjectId();
      if (activeId) {
        this.loadBudgetItems();
      } else {
        this.budgetItemsSignal.set([]);
      }
    });
  }

  // Authorized personnel list
  readonly authorizedPersonnel = computed(() =>
    this.teamUsersStore
      .teamUsers()
      .filter((user: TeamUsersEntity) => user.role === 'Logistica')
      .map((user: TeamUsersEntity) => `${user.fullName} - ${user.role}`),
  );

  /**
   * Reactive list that merges real budget items with progress entries.
   */
  readonly budgetItems = computed(() => {
    const currentId = this.projectsStore.currentProjectId();
    const query = this.searchQuery().toLowerCase();
    const realBudgets = this.budgetItemsSignal();
    const allProgress = this.progressStore.progressList();

    const combinedList = [...realBudgets];

    allProgress.forEach((progress: ProjectProgress) => {
      const hasBudget = realBudgets.some((b) => b.progressId === progress.id);
      if (!hasBudget) {
        combinedList.push({
          id: Math.floor(Math.random() * 100000),
          projectId: progress.projectId,
          progressId: progress.id,
          code: 'NEW',
          name: progress.activityName,
          description: progress.details || 'Pending budget assignment',
          budgeted: 0,
          executed: 0,
          available: 0,
          progress: 0,
          status: 'risk',
          alert: 'Needs budget assignment',
          expenseHistory: [],
        });
      }
    });

    return combinedList.filter(
      (item) =>
        item.projectId === currentId &&
        (item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query)),
    );
  });

  // Reactive totals
  readonly totalBudgeted = computed(() =>
    this.budgetItems().reduce((sum, item) => sum + item.budgeted, 0),
  );
  readonly totalExecuted = computed(() =>
    this.budgetItems().reduce((sum, item) => sum + item.executed, 0),
  );
  readonly totalAvailable = computed(() => this.totalBudgeted() - this.totalExecuted());
  readonly executionPercentage = computed(() =>
    this.projectLimit() > 0 ? (this.totalExecuted() / this.projectLimit()) * 100 : 0,
  );

  /**
   * NEW: Project Global Budget Limit
   * Retrieves the limit defined in the Project's master file (totalBudget)
   */
  readonly projectLimit = computed(() => this.projectsStore.currentProject()?.totalBudget || 0);

  /**
   * NEW: Unallocated project funds
   * Difference between the project's global limit and what has been assigned to advances.
   */
  readonly unallocatedBudget = computed(() => this.projectLimit() - this.totalBudgeted());

  /**
   * NEW: Over-allocation flag
   * True if the sum of all activities exceeds the project's global budget.
   */
  readonly isProjectOverAllocated = computed(() => this.totalBudgeted() > this.projectLimit());

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  selectItem(item: BudgetItemEntity | null) {
    this.selectedItem.set(item);
  }

  /**
   * Adds an expense and persists it to the backend.
   */
  addExpense(itemId: number, expenseData: any): boolean {
    const items = this.budgetItemsSignal();
    const target = items.find((i) => i.progressId === Number(itemId));

    if (!target || target.available < expenseData.amount) return false;

    const realBudgetItemId = target.id;
    const newExecuted = Number(target.executed) + Number(expenseData.amount);

    const updatedItem: BudgetItemEntity = {
      ...target,
      executed: newExecuted,
      available: target.budgeted - newExecuted,
      progress: Math.round((newExecuted / target.budgeted) * 100),
      expenseHistory: [...(target.expenseHistory || []), { ...expenseData, date: new Date() }],
    };

    this.budgetItemsSignal.update((list) =>
      list.map((item) => (item.id === realBudgetItemId ? updatedItem : item)),
    );

    this.budgetApi.updateBudget(String(realBudgetItemId), updatedItem).subscribe();

    return true;
  }

  /**
   * Handles budget extensions with safe mathematical summation (1k + 18k = 19k).
   */
  addExtension(progressId: number, amount: any) {
    const realItems = this.budgetItemsSignal();
    const target = realItems.find((i) => i.progressId === progressId);

    // Force numeric conversion to avoid string concatenation
    const extensionAmount = Number(amount);

    if (target) {
      // Logic for existing item: SUM the values
      const newBudgeted = Number(target.budgeted) + extensionAmount;

      const updatedItem = {
        ...target,
        budgeted: newBudgeted,
        available: newBudgeted - target.executed,
        progress: Math.round((target.executed / newBudgeted) * 100),
      };

      this.budgetApi
        .updateBudget(String(target.id), updatedItem)
        .subscribe(() => this.loadBudgetItems());
    } else {
      // New Record Creation (POST)
      const progress = this.progressStore
        .progressList()
        .find((p: ProjectProgress) => p.id === progressId);
      if (!progress) return;

      const newItem: BudgetItemEntity = {
        id: Math.floor(Math.random() * 100000),
        projectId: progress.projectId,
        progressId: progress.id,
        code: '01.XX',
        name: progress.activityName,
        description: progress.details,
        budgeted: extensionAmount,
        executed: 0,
        available: extensionAmount,
        progress: 0,
        status: 'normal',
        alert: null,
        expenseHistory: [],
      };

      this.budgetApi.createBudget(newItem).subscribe(() => this.loadBudgetItems());
    }
  }

  /**
   * Loads budget items from the server.
   */
  loadBudgetItems() {
    this.budgetApi.getAllBudgets().subscribe({
      next: (responses) => {
        const entities = BudgetAssembler.toEntityList(responses);
        this.budgetItemsSignal.set(entities);
      },
      error: (err) => {
        console.error('Error fetching budgets', err);
        this.budgetItemsSignal.set([]);
      },
    });
  }
}
