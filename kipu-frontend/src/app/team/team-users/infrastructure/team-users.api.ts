import { inject, Injectable } from '@angular/core';
import { Observable, map, identity, of } from 'rxjs';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamUsersResponse } from './team-users.response';
import { TeamUsersAssembler } from './team-users.assembler';
import { TeamUsersResource } from './team-users.response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MaterialEntity } from '../../../logistics/domain/material.entity';
import { TeamWorkersEntity } from '../../team-workers/domain/model/team-workers.entity';
import { TeamWorkersResponse } from '../../team-workers/infrastructure/team-workers.response';
import { TeamWorkersAssembler } from '../../team-workers/infrastructure/team-workers.assembler';
import { TeamUsersStore } from '../application/team-users.store';
import { Identity } from '../../../identity/domain/identity.model';

@Injectable({
  providedIn: 'root',
})
export class TeamUsersApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  teamUsersEndpoint = environment.kipuApiTeamUsersEndpointPath;
  teamUsersUrl = `${this.apiBaseUrl}${this.teamUsersEndpoint}`;

  getAllUsers(projectId: string): Observable<TeamUsersEntity[]> {
    return this.http
      .get<TeamUsersResponse>(`${this.teamUsersUrl}?projectId=${projectId}`)
      .pipe(map((response) => TeamUsersAssembler.toEntitiesFromResponse(response)));
  }

  getCurrentUser(): Observable<Identity | null> {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('✅ Current user obtenido de localStorage:', user);
      return of(user);
    }

    console.warn('⚠️ No hay usuario en localStorage');
    return of(null);
  }

  postUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    return this.http.post<TeamUsersEntity>(this.teamUsersUrl, user);
  }

  updateUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    const url = `${this.teamUsersUrl}/${user.id}`;
    return this.http.put<TeamUsersEntity>(url, user);
  }

  // Invitations
  invitationsEndpoint = environment.kipuApiInvitationsEndpointPath;
  invitationsUrl = `${this.apiBaseUrl}${this.invitationsEndpoint}`;

  postInvitation(invitation: any): Observable<any> {
    return this.http.post<any>(this.invitationsUrl, invitation);
  }

  getInvitations(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.invitationsUrl}?projectId=${projectId}`);
  }

  getInvitationsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.invitationsUrl}/user/${email}`);
  }

  acceptInvitation(id: number): Observable<any> {
    return this.http.put<any>(`${this.invitationsUrl}/${id}/accept`, {});
  }

  rejectInvitation(id: number): Observable<any> {
    return this.http.put<any>(`${this.invitationsUrl}/${id}/reject`, {});
  }
}

