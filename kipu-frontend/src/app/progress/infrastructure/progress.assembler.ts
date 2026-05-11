import { ProgressResponse } from './progress.response';
import { ProjectProgress, ProgressStatus } from '../domain/progress.entity';

export class ProgressAssembler {
  static toEntity(response: ProgressResponse): ProjectProgress {
    return {
      id: response.id,
      projectId: response.projectId,
      projectName: response.projectName,
      activityName: response.activityName,
      details: response.details,
      specialty: response.specialty,
      status: response.status as ProgressStatus,
      currentPercentage: response.currentPercentage,
      startDate: new Date(response.startDate), // We add this mapping
      endDate: new Date(response.endDate), // We add this mapping
      lastUpdate: new Date(response.lastUpdate),
    };
  }

  static toEntityList(responses: ProgressResponse[]): ProjectProgress[] {
    return responses.map(this.toEntity);
  }
}
