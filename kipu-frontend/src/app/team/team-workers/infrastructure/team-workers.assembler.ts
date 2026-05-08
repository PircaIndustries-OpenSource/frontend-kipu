import { TeamWorkersEntity } from '../domain/model/team-workers.entity';
import { TeamWorkersResource, TeamWorkersResponse } from './team-workers.response';


export class TeamWorkersAssembler {
  static toEntityFromResource(resource: TeamWorkersResource): TeamWorkersEntity {
    return {
      id: resource.id,
      dni: resource.dni,
      fullName: resource.fullName,
      role: resource.role,
      status: resource.status,
      assignedTools: resource.assignedTools
    }
  }
  static toEntitiesFromResponse(response: TeamWorkersResponse): TeamWorkersEntity[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
