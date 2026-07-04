import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { TeamWorkersEntity } from '../domain/model/team-workers.entity';
import { TeamWorkersResponse, TeamWorkersResource, CreateTeamWorkerRequest } from './team-workers.response';
import { TeamWorkersAssembler } from './team-workers.assembler';

@Injectable({
  providedIn: 'root',
})
export class TeamWorkersApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  teamWorkersUrl = `${this.apiBaseUrl}${environment.kipuApiTeamWorkersEndpointPath}`;

  getAllWorkers(): Observable<TeamWorkersEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.teamWorkersUrl}?projectId=${projectId}` : this.teamWorkersUrl;
    return this.http
      .get<TeamWorkersResponse>(url)
      .pipe(map((response) => TeamWorkersAssembler.toEntitiesFromResponse(response)));
  }

  postWorker(worker: CreateTeamWorkerRequest): Observable<TeamWorkersEntity> {
    return this.http
      .post<TeamWorkersResource>(this.teamWorkersUrl, worker)
      .pipe(map((r) => TeamWorkersAssembler.toEntityFromResource(r)));
  }

  deleteWorker(id: string): Observable<void> {
    return this.http.delete<void>(`${this.teamWorkersUrl}/${id}`);
  }

  assignMachinery(workerId: string, machineryId: string, fullName: string): Observable<TeamWorkersEntity> {
    return this.http
      .post<TeamWorkersResource>(`${this.teamWorkersUrl}/${workerId}/machineries`, { machineryId, fullName })
      .pipe(map((r) => TeamWorkersAssembler.toEntityFromResource(r)));
  }

  removeMachinery(workerId: string, machineryId: string): Observable<TeamWorkersEntity> {
    return this.http
      .delete<TeamWorkersResource>(`${this.teamWorkersUrl}/${workerId}/machineries/${machineryId}`)
      .pipe(map((r) => TeamWorkersAssembler.toEntityFromResource(r)));
  }
}
