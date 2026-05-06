import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

// Importing the external budget logic into the presentation layer
import { BudgetStore } from '../../../../budget/application/budget-store';

@Component({
  selector: 'app-budget-page',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './budget-page.html',
})
export class BudgetPage implements OnInit {
  // Inject the store to manage application state
  protected budgetStore = inject(BudgetStore);

  // Expose signals to the HTML template for reactive rendering
  protected readonly items = this.budgetStore.budgetItems;

  /**
   * Lifecycle hook triggered when the component is initialized.
   */
  ngOnInit() {
    this.budgetStore.loadBudgetItems();
  }

  /**
   * Helper method to determine the CSS classes for the progress badge
   * based on the execution percentage.
   * @param progress Execution percentage
   */
  getBadgeClass(progress: number): string {
    if (progress > 100) return 'bg-red-100 text-red-700';
    if (progress > 75) return 'bg-red-100 text-red-700';
    if (progress < 50) return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  }

  /**
   * Helper method to determine the CSS class for the progress bar color
   * @param progress Execution percentage
   */
  getProgressBarClass(progress: number): string {
    if (progress > 100) return 'bg-red-600';
    if (progress > 75) return 'bg-red-600';
    if (progress < 50) return 'bg-blue-500';
    return 'bg-green-500';
  }
}
