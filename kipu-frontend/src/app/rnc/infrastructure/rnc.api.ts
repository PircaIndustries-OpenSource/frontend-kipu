import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RncResource } from './rnc.response';
import { RncAssembler } from './rnc.assembler';
import { RncEntity } from '../domain/model/rnc.entity';

/**
 * Service to handle HTTP requests to the RNC Mock Backend.
 */
@Injectable({
  providedIn: 'root',
})
export class RncApi {
  private readonly baseUrl = 'http://localhost:3000/rnc';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RncEntity[]> {
    return this.http
      .get<RncResource[]>(this.baseUrl)
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
