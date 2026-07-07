import { BudgetResponse } from './budget-response';
import { BudgetItemEntity } from '../domain/budget-item.entity';

export class BudgetAssembler {
  static toEntity(response: BudgetResponse): BudgetItemEntity {
    return {
      id: Number(response.id),
      projectId: response.projectId,
      progressId: response.progressId,
      code: response.code,
      name: response.name,
      description: response.description,
      budgeted: response.budgeted,
      executed: response.executed,
      available: response.available,
      progress: response.progress,
      status: response.status,
      alert: response.alert,
      expenseHistory: (response.expenseHistory || []).map((e) => ({
        ...e,
        date: new Date(e.date),
      })),
    };
  }

  static toEntityList(responses: BudgetResponse[]): BudgetItemEntity[] {
    return responses.map(this.toEntity);
  }
}
