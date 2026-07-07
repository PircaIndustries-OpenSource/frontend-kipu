export interface ExpenseHistoryResponse {
  id: number;
  concept: string;
  amount: number;
  responsible: string;
  description: string;
  date: string;
}

/**
 * Represents the raw JSON data structure received from the Budget API.
 */
export interface BudgetResponse {
  id: string;
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
  expenseHistory?: ExpenseHistoryResponse[];
}
