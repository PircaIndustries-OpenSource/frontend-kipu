import { ProjectResource, ProjectsResponse } from './project.response';
import { ProjectEntity } from '../domain/project.entity';

export class ProjectAssembler {
  static toEntityFromResource(resource: ProjectResource): ProjectEntity {
    return {
      id: resource.id,
      name: resource.name,
      description: resource.description,
      status: resource.status,
      startDate: resource.startDate,
      endDate: resource.endDate,
      totalBudget: resource.totalBudget,
      location: resource.location,
      createdAt: resource.createdAt,
      createdBy: resource.createdBy,
      statusJustification: resource.statusJustification,
      imageUrl: resource.imageUrl,
      progress: resource.progress,
    };
  }

  static toEntitiesFromResponse(response: ProjectsResponse): ProjectEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  static toResourceFromEntity(entity: ProjectEntity): ProjectResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      totalBudget: entity.totalBudget,
      location: entity.location,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      statusJustification: entity.statusJustification,
      imageUrl: entity.imageUrl,
      progress: entity.progress,
    };
  }
}
