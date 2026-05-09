// infrastructure/api/document.api.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, map, Observable, tap } from 'rxjs';
import { DocumentEntity } from '../domain/model/document.entity';
import { DocumentResource, DocumentResponse } from './document.response';
import { DocumentAssembler } from './document.assembler';

@Injectable({
  providedIn: 'root',
})
export class DocumentApi {
  http: HttpClient = inject(HttpClient);
  apiBaseUrl = environment.kipuApiBaseUrl;
  documentsEndpoint = environment.kipuApiDocumentsEndpointPath; // 'documents'
  documentsUrl = `${this.apiBaseUrl}${this.documentsEndpoint}`;

  getAllDocuments(): Observable<DocumentEntity[]> {
    return this.http
      .get<DocumentResponse>(this.documentsUrl)
      .pipe(map((response) => DocumentAssembler.toEntitiesFromResponse(response)));
  }

  getDocumentsByProject(projectId: string): Observable<DocumentEntity[]> {
    const url = `${this.documentsUrl}?projectId=${projectId}`;
    return this.http
      .get<DocumentResponse>(url)
      .pipe(map((response) => DocumentAssembler.toEntitiesFromResponse(response)));
  }

  getDocumentById(id: string): Observable<DocumentEntity> {
    const url = `${this.documentsUrl}/${id}`;
    return this.http
      .get<DocumentResource>(url)
      .pipe(map((resource) => DocumentAssembler.toEntityFromResource(resource)));
  }

  postDocument(document: DocumentEntity): Observable<DocumentEntity> {
    const resource = DocumentAssembler.toResourceFromEntity(document);
    return this.http
      .post<DocumentResource>(this.documentsUrl, resource)
      .pipe(map((createdResource) => DocumentAssembler.toEntityFromResource(createdResource)));
  }

  updateDocument(document: DocumentEntity): Observable<DocumentEntity> {
    const url = `${this.documentsUrl}/${document.id}`;
    return this.http.put<DocumentEntity>(url, document).pipe(
      tap(() => console.log('Documento actualizado en API:', document)),
      catchError((error) => {
        console.error('Error en updateDocument:', error);
        throw error;
      }),
    );
  }

  deleteDocument(id: string): Observable<void> {
    const url = `${this.documentsUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
