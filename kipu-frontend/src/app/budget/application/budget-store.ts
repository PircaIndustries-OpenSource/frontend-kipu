import { computed, inject, Injectable, signal } from '@angular/core';
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
  private readonly budgetApi = inject(BudgetApi);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly progressStore = inject(ProgressStore);
  private readonly teamUsersStore = inject(TeamUsersStore);

  private readonly budgetItemsSignal = signal<BudgetItemEntity[]>([]);
  private readonly searchQuery = signal<string>('');
  readonly selectedItem = signal<BudgetItemEntity | null>(null);

  readonly authorizedPersonnel = computed(() =>
    this.teamUsersStore
      .teamUsers()
      .filter((user: TeamUsersEntity) => user.role === 'Logística')
      .map((user: TeamUsersEntity) => `${user.fullName} - ${user.role}`),
  );

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

  readonly projectLimit = computed(() => this.projectsStore.currentProject()?.totalBudget || 0);
  readonly unallocatedBudget = computed(() => this.projectLimit() - this.totalBudgeted());
  readonly isProjectOverAllocated = computed(() => this.totalBudgeted() > this.projectLimit());

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  selectItem(item: BudgetItemEntity | null) {
    this.selectedItem.set(item);
  }

  /**
   * When budget is 0, the amount defines the total budget (via extensions endpoint).
   * When budget > 0, the amount is deducted from available (via expenses endpoint).
   */
  addExpense(itemId: number, expenseData: any): Promise<boolean> {
    const amount = Number(expenseData.amount);

    let target = this.budgetItemsSignal().find((i) => i.progressId === Number(itemId));
    let needsCreate = false;

    if (!target) {
      const computedItems = this.budgetItems();
      target = computedItems.find((i) =>
        i.progressId === Number(itemId) &&
        !this.budgetItemsSignal().some((r) => r.progressId === i.progressId),
      );
      needsCreate = !!target;
    }

    if (!target) return Promise.resolve(false);

    const isNewBudget = target.budgeted === 0;

    return new Promise<boolean>((resolve) => {
      const doApiCall = (realId: number) => {
        if (isNewBudget) {
          this.budgetApi.addExtensionToBudget(realId, {
            amount,
            reason: 'Initial budget assignment',
            responsible: expenseData.responsible || 'System',
          }).subscribe({
            next: (response) => {
              this.budgetItemsSignal.update((list) =>
                list.map((item) => (item.id === realId ? {
                  ...item,
                  budgeted: response.budgeted,
                  available: response.available,
                  executed: response.executed,
                  progress: response.progress,
                  status: response.status,
                  alert: response.alert,
                } : item)),
              );
              resolve(true);
            },
            error: (err) => { console.error('Failed to define budget', err); resolve(false); },
          });
        } else {
          this.budgetApi.addExpenseToBudget(realId, {
            concept: expenseData.concept || 'Expense',
            amount,
            responsible: expenseData.responsible || 'System',
            description: expenseData.description || '',
          }).subscribe({
            next: (response) => {
              this.budgetItemsSignal.update((list) =>
                list.map((item) => (item.id === realId ? {
                  ...item,
                  budgeted: response.budgeted,
                  executed: response.executed,
                  available: response.available,
                  progress: response.progress,
                  status: response.status,
                  alert: response.alert,
                  expenseHistory: (response.expenseHistory || []).map((e: any) => ({
                    concept: e.concept,
                    amount: e.amount,
                    responsible: e.responsible,
                    description: e.description,
                    date: new Date(e.date),
                  })),
                } : item)),
              );
              resolve(true);
            },
            error: (err) => { console.error('Failed to add expense', err); resolve(false); },
          });
        }
      };

      if (needsCreate) {
        this.budgetApi.createBudget({
          projectId: target!.projectId,
          progressId: target!.progressId,
          code: '01.XX',
          name: target!.name,
          description: target!.description,
          budgeted: 0,
        }).subscribe({
          next: (response) => {
            const serverId = Number(response.id);
            doApiCall(serverId);
          },
          error: (err) => {
            console.error('Failed to create budget', err);
            resolve(false);
          },
        });
      } else {
        doApiCall(target.id);
      }
    });
  }

  addExtension(progressId: number, amount: any) {
    const realItems = this.budgetItemsSignal();
    let target = realItems.find((i) => i.progressId === progressId);
    const extensionAmount = Number(amount);

    if (target) {
      this.budgetApi.addExtensionToBudget(target.id, {
        amount: extensionAmount,
        reason: 'Budget extension',
        responsible: 'System',
      }).subscribe({
        next: (response) => {
          this.budgetItemsSignal.update((list) =>
            list.map((item) => (item.id === target!.id ? {
              ...item,
              budgeted: response.budgeted,
              available: response.available,
              progress: response.progress,
              status: response.status,
              alert: response.alert,
            } : item)),
          );
        },
        error: (err) => console.error('Failed to add extension', err),
      });
    } else {
      const progress = this.progressStore.progressList().find((p: ProjectProgress) => p.id === progressId);
      if (!progress) return;

      this.budgetApi.createBudget({
        projectId: progress.projectId,
        progressId: progress.id,
        code: '01.XX',
        name: progress.activityName,
        description: progress.details,
        budgeted: extensionAmount,
      }).subscribe({
        next: (response) => {
          const newItem = BudgetAssembler.toEntity(response);
          this.budgetItemsSignal.update((list) => [...list, newItem]);
        },
        error: (err) => console.error('Failed to create extension budget', err),
      });
    }
  }

  loadBudgetItems() {
    this.budgetApi.getAllBudgets().subscribe({
      next: (responses) => {
        const entities = BudgetAssembler.toEntityList(responses);
        this.budgetItemsSignal.set(entities);
      },
      error: (err) => {
        console.error('Error fetching budgets', err);
      },
    });
  }

  createBudgetItem(progress: ProjectProgress): void {
    const existingItem = this.budgetItemsSignal().find((b) => b.progressId === progress.id);
    if (existingItem) return;

    const tempId = Math.floor(Math.random() * 100000);
    const tempItem: BudgetItemEntity = {
      id: tempId,
      projectId: progress.projectId,
      progressId: progress.id,
      code: '01.XX',
      name: progress.activityName,
      description: progress.details || 'Pending budget assignment',
      budgeted: 0,
      executed: 0,
      available: 0,
      progress: 0,
      status: 'risk',
      alert: 'Needs budget assignment',
      expenseHistory: [],
    };

    this.budgetItemsSignal.update((list) => [...list, tempItem]);

    this.budgetApi.createBudget({
      projectId: progress.projectId,
      progressId: progress.id,
      code: '01.XX',
      name: progress.activityName,
      description: progress.details || 'Pending budget assignment',
      budgeted: 0,
    }).subscribe({
      next: (response) => {
        this.budgetItemsSignal.update((list) =>
          list.map((item) => (item.id === tempId ? {
            ...item,
            id: Number(response.id),
          } : item)),
        );
      },
      error: (err) => {
        console.error('Failed to create budget item', err);
        this.budgetItemsSignal.update((list) => list.filter((i) => i.id !== tempId));
      },
    });
  }
}
