import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RncResource } from './rnc.response';
import { RncAssembler } from './rnc.assembler';
import { RncEntity } from '../domain/model/rnc.entity';
import { environment } from '../../../environments/environment';

/**
 * Service to handle HTTP requests to the RNC API.
 */
@Injectable({
  providedIn: 'root',
})
export class RncApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.kipuApiBaseUrl}/rnc`;

  getAll(): Observable<RncEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.baseUrl}?projectId=${projectId}` : this.baseUrl;
    return this.http
      .get<RncResource[]>(url)
      .pipe(map((resources) => RncAssembler.toEntitiesFromResponse(resources)));
  }

  create(rnc: RncEntity): Observable<RncEntity> {
    return this.http
      .post<RncResource>(this.baseUrl, rnc)
      .pipe(map((resource) => RncAssembler.toEntityFromResource(resource)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(rnc: RncEntity): Observable<RncEntity> {
    return this.http.put<RncEntity>(`${this.baseUrl}/${rnc.id}`, rnc);
  }
}
