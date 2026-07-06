import { ProgressResponse } from './progress.response';
import { ProjectProgress, ProgressStatus } from '../domain/progress.entity';

export class ProgressAssembler {
  static toEntity(response: ProgressResponse): ProjectProgress {
    return {
      id: response.id,
      projectId: String(response.projectId),
      projectName: response.projectName,
      activityName: response.activityName,
      details: response.details,
      specialty: response.specialty,
      status: response.status as ProgressStatus,
      currentPercentage: response.currentPercentage,
      startDate: new Date(response.startDate), // We add this mapping
      endDate: new Date(response.endDate), // We add this mapping
      lastUpdate: new Date(response.lastUpdate),

      responsible: response.responsible || '',
      workers: response.workers || 0,
      weather: response.weather || 'sunny',

      // Assembler mappings for the new architecture keys
      weight: response.weight !== undefined ? Number(response.weight) : undefined,
      isMiniAdvance: response.isMiniAdvance === true,
      parentId: response.parentId ? Number(response.parentId) : null,
    };
  }

  static toEntityList(responses: ProgressResponse[]): ProjectProgress[] {
    return responses.map(this.toEntity);
  }
}
