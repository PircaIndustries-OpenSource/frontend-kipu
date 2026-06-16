import { TeamWorkersEntity } from '../domain/model/team-workers.entity';
import { TeamWorkersResource, TeamWorkersResponse } from './team-workers.response';

export class TeamWorkersAssembler {
  static toEntityFromResource(resource: TeamWorkersResource): TeamWorkersEntity {
    return {
      id: resource.id,
      dni: resource.dni,
      fullName: resource.fullName,
      role: resource.role,
      isActive: resource.isActive,
      projectId: resource.projectId,
      machineries: resource.machineries || [],
    };
  }

  static toEntitiesFromResponse(response: TeamWorkersResponse): TeamWorkersEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }
}
