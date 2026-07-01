import { TeamUsersResource, TeamUsersResponse } from './team-users.response';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { Identity } from '../../../identity/domain/identity.model';

export class TeamUsersAssembler {
  static toEntityFromResource(resource: any): TeamUsersEntity{
    return {
      id: resource.id,
      userId: resource.userId,
      fullName: resource.fullName || resource.username || 'Usuario Invitado',
      email: resource.email,
      isActive: resource.isActive !== undefined ? resource.isActive : true,
      role: resource.role
    };
  }

  static toEntitiesFromResponse(response: TeamUsersResponse): TeamUsersEntity[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }

  static toEntityFromIdentity (identity: Identity | null): TeamUsersEntity {

    if (!identity) {
      const emptyEntity = new TeamUsersEntity();
      emptyEntity.fullName = 'Usuario no encontrado';
      return emptyEntity;
    }

    return {
      id: identity.id!,
      userId: Number(identity.id!) || 0,
      fullName: identity.name!,
      email: identity.email,
      isActive: true,
      role: identity.role!

    }
  }
}
