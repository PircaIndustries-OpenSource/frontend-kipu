import { BudgetResponse } from './budget-response';
import { BudgetItemEntity } from '../domain/budget-item.entity';

/**
 * Assembler responsible for mapping infrastructure responses to domain entities.
 */
export class BudgetAssembler {
  /**
   * Transforms a single BudgetResponse into a BudgetItemEntity.
   */
  static toEntity(response: BudgetResponse): BudgetItemEntity {
    return {
      id: response.id,
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
    };
  }

  /**
   * Transforms an array of responses into an array of entities.
   */
  static toEntityList(responses: BudgetResponse[]): BudgetItemEntity[] {
    return responses.map(this.toEntity);
  }
}
