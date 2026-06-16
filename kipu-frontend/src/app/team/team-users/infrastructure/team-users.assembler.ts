import { TeamUsersResource, TeamUsersResponse } from './team-users.response';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { Identity } from '../../../identity/domain/identity.model';

export class TeamUsersAssembler {
  static toEntityFromResource(resource: TeamUsersResource): TeamUsersEntity {
    return {
      id: resource.id,
      fullName: resource.fullName,
      email: resource.email,
      isActive: resource.isActive,
      role: resource.role,
      projectId: resource.projectId,
    };
  }

  static toEntitiesFromResponse(response: TeamUsersResponse): TeamUsersEntity[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  static toEntityFromIdentity(identity: Identity | null): TeamUsersEntity {
    if (!identity) {
      const emptyEntity = new TeamUsersEntity();
      emptyEntity.fullName = 'Usuario no encontrado';
      return emptyEntity;
    }

    return {
      id: identity.id!,
      fullName: identity.name!,
      email: identity.email,
      isActive: true,
      role: identity.role!,
      projectId: localStorage.getItem('currentProjectId') || '',
    };
  }
}
