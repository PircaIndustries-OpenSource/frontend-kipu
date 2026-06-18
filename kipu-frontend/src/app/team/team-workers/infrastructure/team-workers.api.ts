import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { TeamWorkersEntity } from '../domain/model/team-workers.entity';
import { TeamWorkersResource, TeamWorkersResponse } from './team-workers.response';
import { TeamWorkersAssembler } from './team-workers.assembler';

@Injectable({
  providedIn: 'root',
})
export class TeamWorkersApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiHostLocal;
  teamWorkersEndpoint = environment.kipuApiTeamWorkersEndpointPath;
  BASE_URL = `${this.apiBaseUrl}${this.teamWorkersEndpoint}`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllWorkers(projectId: string, globalSearch?: string): Observable<TeamWorkersEntity[]> {
    let params = new HttpParams().set('projectId', projectId);

    if (globalSearch && globalSearch.trim() !== '') {
      params = params.set('globalSearch', globalSearch.trim());
    }

    return this.http
      .get<TeamWorkersResponse>(this.BASE_URL, { headers: this.getHeaders(), params })
      .pipe(map((response) => TeamWorkersAssembler.toEntitiesFromResponse(response)));
  }

  postWorker(payload: any): Observable<TeamWorkersEntity> {
    return this.http
      .post<TeamWorkersResource>(this.BASE_URL, payload, { headers: this.getHeaders() })
      .pipe(map((res) => TeamWorkersAssembler.toEntityFromResource(res)));
  }

  deleteWorker(id: string): Observable<void> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }

  assignMachinery(
    teamWorkerId: string,
    payload: { machineryId: string; fullName: string },
  ): Observable<TeamWorkersEntity> {
    const url = `${this.BASE_URL}/${teamWorkerId}/machineries`;

    return this.http
      .post<TeamWorkersResource>(url, payload, { headers: this.getHeaders() })
      .pipe(map((res) => TeamWorkersAssembler.toEntityFromResource(res)));
  }
}
