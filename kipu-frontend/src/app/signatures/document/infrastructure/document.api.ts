import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { DocumentEntity } from '../domain/model/document.entity';
import { DocumentResource, DocumentResponse } from './document.response';
import { DocumentAssembler } from './document.assembler';

@Injectable({
  providedIn: 'root',
})
export class DocumentApi {
  http: HttpClient = inject(HttpClient);

  apiBaseUrl = environment.kipuApiHostLocal;
  documentsEndpoint = '/documents';
  BASE_URL = `${this.apiBaseUrl}${this.documentsEndpoint}`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // GET /api/v1/documents?projectId={id}
  getAllDocuments(projectId: string): Observable<DocumentEntity[]> {
    const params = new HttpParams().set('projectId', projectId);
    return this.http
      .get<DocumentResponse>(this.BASE_URL, { headers: this.getHeaders(), params })
      .pipe(map((response) => DocumentAssembler.toEntitiesFromResponse(response)));
  }

  // POST /api/v1/documents
  postDocument(payload: any): Observable<DocumentEntity> {
    return this.http
      .post<DocumentResource>(this.BASE_URL, payload, { headers: this.getHeaders() })
      .pipe(map((resource) => DocumentAssembler.toEntityFromResource(resource)));
  }

  // PATCH /api/v1/documents/sign/{id}
  signDocument(id: string): Observable<DocumentEntity> {
    const url = `${this.BASE_URL}/sign/${id}`;
    return this.http
      .patch<DocumentResource>(url, {}, { headers: this.getHeaders() })
      .pipe(map((resource) => DocumentAssembler.toEntityFromResource(resource)));
  }
}
