import { ProgressResponse } from './progress.response';
import { ProjectProgress, ProgressStatus } from '../domain/progress.entity';

/**
 * Assembler responsible for mapping infrastructure responses to domain entities.
 */
export class ProgressAssembler {
  /**
   * Transforms a single ProgressResponse into a ProjectProgress entity.
   */
  static toEntity(response: ProgressResponse): ProjectProgress {
    return {
      id: response.id,
      projectId: response.projectId,
      projectName: response.projectName, // Now the mapping is complete!
      activityName: response.activityName,
      details: response.details,
      specialty: response.specialty,
      status: response.status as ProgressStatus,
      currentPercentage: response.currentPercentage,
      lastUpdate: new Date(response.lastUpdate),
    };
  }

  /**
   * Transforms an array of ProgressResponses into an array of ProjectProgress entities.
   */
  static toEntityList(responses: ProgressResponse[]): ProjectProgress[] {
    return responses.map(this.toEntity);
  }
}
