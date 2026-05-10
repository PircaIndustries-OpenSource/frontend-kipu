import { ProgressResponse } from './progress.response';
import { ProjectProgress, ProgressStatus } from '../domain/progress.entity';

/**
 * Assembler responsible for mapping infrastructure responses to domain entities.
 */
export class ProgressAssembler {
  /**
   * Transforms a single ProgressResponse into a ProjectProgress entity.
   *
   * @param response - The raw data object from the API
   * @returns The mapped domain entity
   */
  static toEntity(response: ProgressResponse): ProjectProgress {
    return {
      id: response.id,
      projectId: response.projectId,
      projectName: response.projectName,
      location: response.location,
      // Cast the string to the specific literal type used in the domain
      status: response.status as ProgressStatus,
      imageUrl: response.imageUrl,
      currentPercentage: response.currentPercentage,
      // Convert ISO string to native Date object for the frontend
      lastUpdate: new Date(response.lastUpdate)
    };
  }

  /**
   * Transforms an array of ProgressResponses into an array of ProjectProgress entities.
   *
   * @param responses - The list of raw data from the API
   * @returns The list of mapped domain entities
   */
  static toEntityList(responses: ProgressResponse[]): ProjectProgress[] {
    return responses.map(this.toEntity);
  }
}
