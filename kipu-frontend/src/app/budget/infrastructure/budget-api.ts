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

  getAllBudgets(): Observable<BudgetResponse[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.budgetUrl}?projectId=${projectId}` : this.budgetUrl;
    return this.http.get<BudgetResponse[]>(url);
  }

  createBudget(data: {
    projectId: string;
    progressId: number;
    code: string;
    name: string;
    description: string;
    budgeted: number;
  }): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(this.budgetUrl, data);
  }

  addExpenseToBudget(id: number, data: {
    concept: string;
    amount: number;
    responsible: string;
    description: string;
  }): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.budgetUrl}/${id}/expenses`, data);
  }

  addExtensionToBudget(id: number, data: {
    amount: number;
    reason: string;
    responsible: string;
  }): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.budgetUrl}/${id}/extensions`, data);
  }
}
