import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetResponse } from './budget-response';

@Injectable({
  providedIn: 'root',
})
export class BudgetApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/v1/budgets';

  /**
   * Fetches all budget items.
   * Can be extended later to filter by progressId: ?progressId=X
   */
  getAllBudgets(): Observable<BudgetResponse[]> {
    return this.http.get<BudgetResponse[]>(this.apiUrl);
  }
}
