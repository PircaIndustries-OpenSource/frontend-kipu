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
   * Fetches all budget items from the server
   */
  getAllBudgets(): Observable<BudgetResponse[]> {
    return this.http.get<BudgetResponse[]>(this.apiUrl);
  }

  /**
   * Updates a specific budget item in db.json
   * @param id The item ID (as string to match json-server expectations)
   * @param data The partial or full object to update
   */
  createBudget(data: any): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(this.apiUrl, data);
  }

  updateBudget(id: string, data: any): Observable<BudgetResponse> {
    return this.http.put<BudgetResponse>(`${this.apiUrl}/${id}`, data);
  }
}
