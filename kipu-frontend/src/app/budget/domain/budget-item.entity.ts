/**
 * Domain entity representing a budget item.
 * Includes the foreign key (progressId) to link it to a specific project progress.
 */
export interface BudgetItemEntity {
  id: number;
  projectId: string;
  progressId: number;
  code: string;
  name: string;
  description: string;
  budgeted: number;
  executed: number;
  available: number;
  progress: number;
  status: string;
  alert: string | null;
  expenseHistory?: any[]; // History of expenses for this specific item
}
