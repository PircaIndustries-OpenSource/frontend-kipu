import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProjectProgress } from '../domain/progress.entity';
import { ProgressResponse } from './progress.response';
import { ProgressAssembler } from './progress.assembler';

/**
 * Service responsible for handling HTTP requests related to project progress.
 */
@Injectable({
  providedIn: 'root'
})
export class ProgressApi {
  private readonly http = inject(HttpClient);

  // Base path mapped via proxy to the json-server
  private readonly basePath = '/api/v1/progress';

  /**
   * Fetches all progress records from the server and maps them to domain entities.
   *
   * @returns An observable containing the list of mapped entities
   */
  getAllProgress(): Observable<ProjectProgress[]> {
    return this.http.get<ProgressResponse[]>(this.basePath).pipe(
      map((responses) => ProgressAssembler.toEntityList(responses))
    );
  };

  createProgress(data: ProjectProgress): Observable<ProjectProgress> {
    return this.http.post<ProjectProgress>(this.basePath, data);
  };
}
