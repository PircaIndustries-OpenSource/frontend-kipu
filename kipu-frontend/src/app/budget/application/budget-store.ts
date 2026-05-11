import { computed, Injectable, signal } from '@angular/core';
import { BudgetItemEntity } from '../domain/budget-item.entity';

@Injectable({
  providedIn: 'root',
})
export class BudgetStore {
  // State signal holding the array of budget items
  private readonly budgetItemsSignal = signal<BudgetItemEntity[]>([]);

  // Computed signal to expose the items reactively to the components
  readonly budgetItems = computed(() => this.budgetItemsSignal());

  // Computed signal: calculates the total budgeted amount across all items
  readonly totalBudgeted = computed(() =>
    this.budgetItems().reduce((sum, item) => sum + item.budgeted, 0),
  );

  // Computed signal: calculates the total executed amount across all items
  readonly totalExecuted = computed(() =>
    this.budgetItems().reduce((sum, item) => sum + item.executed, 0),
  );

  // Computed signal: calculates the remaining available budget
  readonly totalAvailable = computed(() => this.totalBudgeted() - this.totalExecuted());

  /**
   * Mocks the initial data loading.
   * In the future, this should be replaced with a call to BudgetApi.
   */
  loadBudgetItems() {
    const mockData: BudgetItemEntity[] = [
      {
        id: '1',
        progressId: 1, // Linked to "Vaciado de Losa N3" in the Progress module
        code: '01.01',
        name: 'Cimentación',
        description: 'Trabajos preliminares y cimentación',
        budgeted: 80000,
        executed: 65000,
        available: 15000,
        progress: 81,
        status: 'normal',
        alert: null,
      },
      {
        id: '2',
        progressId: 2, // Linked to "Instalación Eléctrica" in the Progress module
        code: '01.02',
        name: 'Estructura',
        description: 'Columnas, vigas y losas',
        budgeted: 50000,
        executed: 38000,
        available: 12000,
        progress: 76,
        status: 'risk',
        alert: 'Compra bloqueada: Solicitud SM-045 excede presupuesto en 12.5%',
      },
    ];

    // Update the signal with the fetched data
    this.budgetItemsSignal.set(mockData);
  }
}
