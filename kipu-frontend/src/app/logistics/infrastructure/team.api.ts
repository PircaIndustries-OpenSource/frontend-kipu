import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TeamUsersEntity } from '../domain/team-users.entity';
import { TeamUsersResponse } from './team-users.response';
import { TeamUsersAssembler } from './team-users.assembler';
import { TeamUsersResource } from './team-users.response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { MaterialEntity } from '../domain/material.entity';
import { TeamWorkersEntity } from '../domain/team-workers.entity';
import { TeamWorkersResponse } from './team-workers.response';
import { TeamWorkersAssembler } from './team-workers.assembler';
import { TeamStore } from '../application/team.store';

@Injectable({
  providedIn: 'root',
})
export class TeamApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  teamEndpoint = environment.kipuApiTeamEndpointPath;
  teamUsersEndpoint = environment.kipuApiTeamUsersEndpointPath;
  teamWorkersEndpoint = environment.kipuApiTeamWorkersEndpointPath;
  teamUsersUrl = `${this.apiBaseUrl}${this.teamUsersEndpoint}`;
  teamWorkersUrl = `${this.apiBaseUrl}${this.teamWorkersEndpoint}`;

  getAllUsers(): Observable<TeamUsersEntity[]> {
    return this.http
      .get<TeamUsersResponse>(this.teamUsersUrl)
      .pipe(map((response) => TeamUsersAssembler.toEntitiesFromResponse(response)));
  }
  getAllWorkers(): Observable<TeamWorkersEntity[]> {
    return this.http
      .get<TeamWorkersResponse>(this.teamWorkersUrl)
      .pipe(map((response) => TeamWorkersAssembler.toEntitiesFromResponse(response)));
  }

  postUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    return this.http.post<TeamUsersEntity>(this.teamUsersUrl, user);
  }

  updateUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    const url = `${this.teamUsersUrl}/${user.id}`;
    return this.http.put<TeamUsersEntity>(url, user);
  }
}

