import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { ProjectProgress } from '../domain/progress.entity';
import { ProgressPhotoEntity } from '../domain/progress-photo.entity';
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
  private readonly basePath = `${environment.kipuApiBaseUrl}/progress`;

  /**
   * Fetches all progress records from the server and maps them to domain entities.
   *
   * @returns An observable containing the list of mapped entities
   */
  getAllProgress(): Observable<ProjectProgress[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.basePath}?projectId=${projectId}` : this.basePath;
    return this.http.get<ProgressResponse[]>(url).pipe(
      map((responses) => ProgressAssembler.toEntityList(responses))
    );
  };

  createProgress(data: ProjectProgress): Observable<ProjectProgress> {
    const payload = {
        ...data,
        percentage: data.currentPercentage
    };
    return this.http.post<ProjectProgress>(this.basePath, payload);
  };

  getAllPhotos(projectId: string): Observable<ProgressPhotoEntity[]> {
    return this.http.get<ProgressPhotoEntity[]>(`${this.basePath}/photos?projectId=${projectId}`);
  }

  createPhoto(photo: ProgressPhotoEntity): Observable<ProgressPhotoEntity> {
    return this.http.post<ProgressPhotoEntity>(`${this.basePath}/photos`, photo);
  }

  updatePhoto(id: number, title: string): Observable<ProgressPhotoEntity> {
    return this.http.put<ProgressPhotoEntity>(`${this.basePath}/photos/${id}`, { title });
  }

  deletePhoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/photos/${id}`);
  }
}
