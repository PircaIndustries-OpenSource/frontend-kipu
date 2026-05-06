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

@Injectable({
  providedIn: 'root',
})

export class TeamApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  teamUsersEndpoint = environment.kipuApiTeamUsersEndpointPath;
  teamWorkersEndpoint = environment.kipuApiTeamWorkersEndpointPath;

  getAllUsers(): Observable<TeamUsersEntity[]> {
    return this.http.get<TeamUsersResponse>(`${this.apiBaseUrl}${this.teamUsersEndpoint}`)
      .pipe(
        map(response => TeamUsersAssembler.toEntitiesFromResponse(response))
      )
  }
  getAllWorkers(): Observable<TeamWorkersEntity[]> {
    return this.http.get<TeamWorkersResponse>(`${this.apiBaseUrl}${this.teamWorkersEndpoint}`)
      .pipe(
        map(response => TeamWorkersAssembler.toEntitiesFromResponse(response))
      )
  }
}

