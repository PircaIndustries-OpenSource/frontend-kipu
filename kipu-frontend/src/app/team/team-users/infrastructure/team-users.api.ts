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

  iamUsersUrl = `${this.apiBaseUrl}${environment.kipuApiIamUsersEndpointPath}`;
  teamUsersUrl = `${this.apiBaseUrl}${environment.kipuApiTeamUsersEndpointPath}`;

  getAllIamUsers(): Observable<Identity[]> {
    return this.http.get<Identity[]>(this.iamUsersUrl);
  }

  getCurrentUser(): Observable<Identity | null> {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      return of(user);
    }

    return of(null);
  }

  createTeamUser(user: any): Observable<any> {
    return this.http.post<any>(this.teamUsersUrl, user);
  }

  updateUser(user: TeamUsersEntity): Observable<TeamUsersEntity> {
    const url = `${this.iamUsersUrl}/${user.id}`;
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
