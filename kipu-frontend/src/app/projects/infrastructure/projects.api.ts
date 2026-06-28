import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProjectEntity } from '../domain/project.entity';
import { ProjectResource, ProjectsResponse } from './project.response';
import { environment } from '../../../environments/environment';
import { ProjectAssembler } from './project.assembler';

@Injectable({
  providedIn: 'root',
})
export class ProjectsApi {
  http = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  projectsEndpoint = environment.kipuApiProjectsEndpointPath;

  getAll(createdBy?: string): Observable<ProjectEntity[]> {
    let url = `${this.apiBaseUrl}${this.projectsEndpoint}`;
    if (createdBy) {
      url += `?createdBy=${encodeURIComponent(createdBy)}`;
    }
    return this.http
      .get<ProjectsResponse>(url)
      .pipe(map((response) => ProjectAssembler.toEntitiesFromResponse(response)));
  }

  getById(id: string): Observable<ProjectEntity> {
    return this.http
      .get<ProjectResource>(`${this.apiBaseUrl}${this.projectsEndpoint}/${id}`)
      .pipe(map((response) => ProjectAssembler.toEntityFromResource(response)));
  }

  create(project: ProjectEntity): Observable<ProjectEntity> {
    const resource = ProjectAssembler.toResourceFromEntity(project);
    return this.http
      .post<ProjectResource>(`${this.apiBaseUrl}${this.projectsEndpoint}`, resource)
      .pipe(map((response) => ProjectAssembler.toEntityFromResource(response)));
  }

  checkNameExists(name: string): Observable<boolean> {
    return this.http
      .get<ProjectsResponse>(`${this.apiBaseUrl}${this.projectsEndpoint}?name=${encodeURIComponent(name)}`)
      .pipe(map((response) => response.length > 0));
  }

  updateStatus(id: string, partialData: Partial<ProjectEntity>): Observable<ProjectEntity> {
    return this.http
      .patch<ProjectResource>(`${this.apiBaseUrl}${this.projectsEndpoint}/${id}`, partialData)
      .pipe(map((response) => ProjectAssembler.toEntityFromResource(response)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}${this.projectsEndpoint}/${id}`);
  }
}
