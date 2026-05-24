import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { TeamWorkersEntity } from '../domain/model/team-workers.entity';
import { TeamWorkersResponse } from './team-workers.response';
import { TeamWorkersAssembler } from './team-workers.assembler';


@Injectable({
  providedIn: 'root',
})
export class TeamWorkersApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  teamWorkersEndpoint = environment.kipuApiTeamWorkersEndpointPath;
  teamWorkersUrl = `${this.apiBaseUrl}${this.teamWorkersEndpoint}`;

  getAllWorkers(): Observable<TeamWorkersEntity[]> {
    return this.http
      .get<TeamWorkersResponse>(this.teamWorkersUrl)
      .pipe(map((response) => TeamWorkersAssembler.toEntitiesFromResponse(response)));
  }

  postWorker(worker: TeamWorkersEntity): Observable<TeamWorkersEntity> {
    return this.http.post<TeamWorkersEntity>(this.teamWorkersUrl, worker);
  }

  updateWorker(worker: TeamWorkersEntity): Observable<TeamWorkersEntity> {
    const url = `${this.teamWorkersUrl}/${worker.id}`;
    return this.http.put<TeamWorkersEntity>(url, worker);
  }

  deleteWorker(id: string): Observable<void> {
    const url = `${this.teamWorkersUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
