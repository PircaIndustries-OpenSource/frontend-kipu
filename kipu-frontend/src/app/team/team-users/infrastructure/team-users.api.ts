import { inject, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamUsersResponse, TeamUsersResource } from './team-users.response';
import { TeamUsersAssembler } from './team-users.assembler';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Identity } from '../../../identity/domain/identity.model';

@Injectable({
  providedIn: 'root',
})
export class TeamUsersApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiHostLocal;
  teamUsersEndpoint = environment.kipuApiTeamUsersEndpointPath;
  BASE_URL: string = `${this.apiBaseUrl}${this.teamUsersEndpoint}`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllUsers(projectId: string, searchTerm?: string): Observable<TeamUsersEntity[]> {
    let params = new HttpParams().set('projectId', projectId);

    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm.trim());
    }

    return this.http
      .get<TeamUsersResponse>(this.BASE_URL, { headers: this.getHeaders(), params })
      .pipe(map((response) => TeamUsersAssembler.toEntitiesFromResponse(response)));
  }

  getCurrentUser(): Observable<Identity | null> {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return of(user);
    }
    return of(null);
  }

  createUser(payload: any): Observable<TeamUsersEntity> {
    return this.http
      .post<TeamUsersResource>(this.BASE_URL, payload, { headers: this.getHeaders() })
      .pipe(map((res) => TeamUsersAssembler.toEntityFromResource(res)));
  }

  updateUserStatus(id: string, isActive: boolean): Observable<TeamUsersEntity> {
    const action = isActive ? 'activate' : 'deactivate';
    return this.http
      .patch<TeamUsersResource>(
        `${this.BASE_URL}/${id}/${action}`,
        {},
        { headers: this.getHeaders() },
      )
      .pipe(map((res) => TeamUsersAssembler.toEntityFromResource(res)));
  }
}
