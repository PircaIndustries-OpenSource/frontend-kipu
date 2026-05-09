import { TeamUsersResource, TeamUsersResponse } from './team-users.response';
import { TeamUsersEntity } from '../domain/model/team-users.entity';

export class TeamUsersAssembler {
  static toEntityFromResource(resource: TeamUsersResource): TeamUsersEntity{
    return {
      id: resource.id,
      fullName: resource.fullName,
      email: resource.email,
      isActive: resource.isActive,
      role: resource.role
    };
  }

  static toEntitiesFromResponse(response: TeamUsersResponse): TeamUsersEntity[] {
    return response.map(resource => this.toEntityFromResource(resource));
  }
}
