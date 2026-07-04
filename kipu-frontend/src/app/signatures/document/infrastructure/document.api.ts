import { HttpClient } from '@angular/common/http';
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
  apiBaseUrl = environment.kipuApiBaseUrl;
  documentsUrl = `${this.apiBaseUrl}${environment.kipuApiDocumentsEndpointPath}`;

  getAllDocuments(): Observable<DocumentEntity[]> {
    const projectId = localStorage.getItem('currentProjectId');
    const url = projectId ? `${this.documentsUrl}?projectId=${projectId}` : this.documentsUrl;
    return this.http
      .get<DocumentResponse>(url)
      .pipe(map((response) => DocumentAssembler.toEntitiesFromResponse(response)));
  }

  getDocumentsByProject(projectId: string): Observable<DocumentEntity[]> {
    const url = `${this.documentsUrl}?projectId=${projectId}`;
    return this.http
      .get<DocumentResponse>(url)
      .pipe(map((response) => DocumentAssembler.toEntitiesFromResponse(response)));
  }

  postDocument(document: DocumentEntity): Observable<DocumentEntity> {
    const resource = DocumentAssembler.toResourceFromEntity(document);
    return this.http
      .post<DocumentResource>(this.documentsUrl, resource)
      .pipe(map((created) => DocumentAssembler.toEntityFromResource(created)));
  }

  sendSignCode(documentId: string, email: string, teamUserId: string): Observable<void> {
    return this.http.post<void>(`${this.documentsUrl}/${documentId}/send-code`, { email, teamUserId });
  }

  signDocument(documentId: string, code: string, email: string, teamUserId: string, fullName: string): Observable<DocumentEntity> {
    return this.http
      .patch<DocumentResource>(`${this.documentsUrl}/sign/${documentId}`, { code, email, teamUserId, fullName })
      .pipe(map((resource) => DocumentAssembler.toEntityFromResource(resource)));
  }
}
