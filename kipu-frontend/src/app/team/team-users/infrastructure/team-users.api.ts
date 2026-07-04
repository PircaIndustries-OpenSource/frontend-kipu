import { inject, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamUsersResponse } from './team-users.response';
import { TeamUsersAssembler } from './team-users.assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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

  getTeamUsersByProject(projectId: string): Observable<TeamUsersEntity[]> {
    return this.http
      .get<TeamUsersResponse>(`${this.teamUsersUrl}?projectId=${projectId}`)
      .pipe(map((response) => TeamUsersAssembler.toEntitiesFromResponse(response)));
  }

  getTeamUsersByEmail(email: string): Observable<TeamUsersEntity[]> {
    return this.http
      .get<TeamUsersResponse>(`${this.teamUsersUrl}/by-email?email=${encodeURIComponent(email)}`)
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

  createTeamUser(user: any): Observable<any> {
    return this.http.post<any>(this.teamUsersUrl, user);
  }

  deactivateTeamUser(id: string): Observable<any> {
    return this.http.patch<any>(`${this.teamUsersUrl}/${id}/deactivate`, {});
  }

  activateTeamUser(id: string): Observable<any> {
    return this.http.patch<any>(`${this.teamUsersUrl}/${id}/activate`, {});
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
