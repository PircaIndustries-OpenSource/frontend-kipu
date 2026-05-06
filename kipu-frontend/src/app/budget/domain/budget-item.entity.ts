/**
 * Represents a budget item in the domain layer.
 * Contains all business attributes required for the budget logic.
 */
export class BudgetItemEntity {
  id: string;             // Unique identifier for the budget item
  code: string;           // Formatted code (e.g., '01.01')
  name: string;           // Name of the item (e.g., 'Cimentación')
  description: string;    // Detailed scope or description
  budgeted: number;       // Initially allocated budget amount
  executed: number;       // Amount already spent or executed
  available: number;      // Remaining available budget
  progress: number;       // Execution percentage (0 to 100+)
  status: 'normal' | 'risk' | 'critical'; // Risk status based on limits
  alert: string | null;   // Blocking alert message if applicable

  constructor() {
    this.id = '';
    this.code = '';
    this.name = '';
    this.description = '';
    this.budgeted = 0;
    this.executed = 0;
    this.available = 0;
    this.progress = 0;
    this.status = 'normal';
    this.alert = null;
  }
}
