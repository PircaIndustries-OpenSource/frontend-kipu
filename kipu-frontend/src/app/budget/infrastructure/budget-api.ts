import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetResponse } from './budget-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.kipuApiBaseUrl;
  private readonly budgetEndpoint = environment.kipuApiBudgetEndpointPath;
  private readonly budgetUrl = `${this.apiUrl}${this.budgetEndpoint}`;

  /**
   * Fetches all budget items from the server
   */
  getAllBudgets(): Observable<BudgetResponse[]> {
    return this.http.get<BudgetResponse[]>(this.budgetUrl);
  }

  /**
   * Updates a specific budget item in db.json
   * @param id The item ID (as string to match json-server expectations)
   * @param data The partial or full object to update
   */
  createBudget(data: any): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(this.budgetUrl, data);
  }

  updateBudget(id: string, data: any): Observable<BudgetResponse> {
    return this.http.put<BudgetResponse>(`${this.budgetUrl}/${id}`, data);
  }
}
