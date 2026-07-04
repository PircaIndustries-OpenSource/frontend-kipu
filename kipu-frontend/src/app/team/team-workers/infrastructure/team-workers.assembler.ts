import { TeamWorkersEntity, WorkerMachinery } from '../domain/model/team-workers.entity';
import { TeamWorkersResource, TeamWorkersResponse } from './team-workers.response';

export class TeamWorkersAssembler {
  static toEntityFromResource(resource: TeamWorkersResource): TeamWorkersEntity {
    const entity = new TeamWorkersEntity();
    entity.id = resource.id;
    entity.dni = resource.dni;
    entity.fullName = resource.fullName;
    entity.role = resource.role;
    entity.isActive = resource.isActive;
    entity.projectId = resource.projectId;
    entity.machineries = (resource.machineries || []).map((m) => ({
      machineryId: m.machineryId,
      fullName: m.fullName,
    }));
    return entity;
  }

  static toEntitiesFromResponse(response: TeamWorkersResponse): TeamWorkersEntity[] {
    return response.map((r) => this.toEntityFromResource(r));
  }
}
