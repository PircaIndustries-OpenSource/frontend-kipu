import { computed, Injectable, signal } from '@angular/core';
import { BudgetItemEntity } from '../domain/budget-item.entity';

@Injectable({
  providedIn: 'root',
})
export class BudgetStore {
  // Persistence key
  private readonly STORAGE_KEY = 'kipu_budget_data';

  // State signals
  private readonly budgetItemsSignal = signal<BudgetItemEntity[]>([]);
  private readonly searchQuery = signal<string>('');
  readonly selectedItem = signal<BudgetItemEntity | null>(null);

  // Authorized personnel list for dropdowns
  readonly authorizedPersonnel = signal<string[]>([
    'Juan Pérez - Gestor Operativo',
    'Asuna Yuuki - Residente de Obra',
    'Kirito G. - Jefe de Cuadrilla',
    'Carlos Ruiz - Operario Maestro',
  ]);

  // Reactive filtered list
  readonly budgetItems = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.budgetItemsSignal().filter(
      (item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query),
    );
  });

  // Reactive totals using computed
  readonly totalBudgeted = computed(() =>
    this.budgetItemsSignal().reduce((sum, item) => sum + item.budgeted, 0),
  );
  readonly totalExecuted = computed(() =>
    this.budgetItemsSignal().reduce((sum, item) => sum + item.executed, 0),
  );
  readonly totalAvailable = computed(() => this.totalBudgeted() - this.totalExecuted());
  readonly executionPercentage = computed(() =>
    this.totalBudgeted() > 0 ? (this.totalExecuted() / this.totalBudgeted()) * 100 : 0,
  );

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  selectItem(item: BudgetItemEntity | null) {
    this.selectedItem.set(item);
  }

  /**
   * Adds an expense, updates history and persists to local storage.
   */
  addExpense(itemId: string, expenseData: any): boolean {
    const items = this.budgetItemsSignal();
    const target = items.find((i) => i.id === itemId);

    if (!target || target.available < expenseData.amount) return false;

    const updatedList = items.map((item) => {
      if (item.id === itemId) {
        const newExecuted = item.executed + expenseData.amount;
        const currentHistory = item.expenseHistory || [];
        return {
          ...item,
          executed: newExecuted,
          available: item.budgeted - newExecuted,
          progress: Math.round((newExecuted / item.budgeted) * 100),
          expenseHistory: [...currentHistory, { ...expenseData, date: new Date() }],
        };
      }
      return item;
    });

    this.budgetItemsSignal.set(updatedList);
    this.saveToStorage(updatedList);
    return true;
  }

  addExtension(itemId: string, amount: number) {
    const updatedList = this.budgetItemsSignal().map((item) => {
      if (item.id === itemId) {
        const newBudgeted = item.budgeted + amount;
        return {
          ...item,
          budgeted: newBudgeted,
          available: newBudgeted - item.executed,
          progress: Math.round((item.executed / newBudgeted) * 100),
        };
      }
      return item;
    });
    this.budgetItemsSignal.set(updatedList);
    this.saveToStorage(updatedList);
  }

  private saveToStorage(data: BudgetItemEntity[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  loadBudgetItems() {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      this.budgetItemsSignal.set(JSON.parse(savedData));
    } else {
      // Default Mock Data
      const mockData: BudgetItemEntity[] = [
        {
          id: '1',
          progressId: 101,
          code: '01.01',
          name: 'Cimentación',
          description: 'Trabajos preliminares y cimentación',
          budgeted: 80000,
          executed: 65000,
          available: 15000,
          progress: 81,
          status: 'normal',
          alert: null,
          expenseHistory: [],
        },
        {
          id: '2',
          progressId: 102,
          code: '01.02',
          name: 'Estructura',
          description: 'Columnas, vigas y losas',
          budgeted: 50000,
          executed: 38000,
          available: 12000,
          progress: 76,
          status: 'risk',
          alert: 'SM-045 excede presupuesto',
          expenseHistory: [],
        },
      ];
      this.budgetItemsSignal.set(mockData);
    }

    /* // --- API CONNECTION READY ---
    // this.budgetApi.getAllBudgets().subscribe(data => {
    //   this.budgetItemsSignal.set(data);
    //   this.saveToStorage(data);
    // });
    */
  }
}
