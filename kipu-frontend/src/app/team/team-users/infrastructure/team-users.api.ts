import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamUsersResponse } from './team-users.response';
import { TeamUsersAssembler } from './team-users.assembler';
import { TeamUsersResource } from './team-users.response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { MaterialEntity } from '../../../logistics/domain/material.entity';
import { TeamWorkersEntity } from '../../team-workers/domain/model/team-workers.entity';
import { TeamWorkersResponse } from '../../team-workers/infrastructure/team-workers.response';
import { TeamWorkersAssembler } from '../../team-workers/infrastructure/team-workers.assembler';
import { TeamUsersStore } from '../application/team-users.store';

@Injectable({
  providedIn: 'root',
})
export class TeamUsersApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  teamUsersEndpoint = environment.kipuApiTeamUsersEndpointPath;
  teamUsersUrl = `${this.apiBaseUrl}${this.teamUsersEndpoint}`;

  getAllUsers(): Observable<TeamUsersEntity[]> {
    return this.http
      .get<TeamUsersResponse>(this.teamUsersUrl)
      .pipe(map((response) => TeamUsersAssembler.toEntitiesFromResponse(response)));
  }


  postUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    return this.http.post<TeamUsersEntity>(this.teamUsersUrl, user);
  }

  updateUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    const url = `${this.teamUsersUrl}/${user.id}`;
    return this.http.put<TeamUsersEntity>(url, user);
  }
}

