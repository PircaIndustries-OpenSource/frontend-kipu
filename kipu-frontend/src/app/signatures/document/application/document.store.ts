import { Injectable, signal } from '@angular/core';
import { DocumentEntity } from '../domain/model/document.entity';
import { DocumentApi } from '../infrastructure/document.api';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentsStore {
  private documents = signal<DocumentEntity[]>([]);
  private currentToken = signal<string | null>(null);
  private currentDocumentId = signal<string | null>(null);

  readonly documents$ = this.documents.asReadonly();
  readonly currentToken$ = this.currentToken.asReadonly();

  constructor(private documentApi: DocumentApi) {}

  loadAllDocuments(): void {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) return;

    this.documentApi.getAllDocuments(projectId).subscribe({
      next: (docs) => this.documents.set(docs),
      error: (err) => console.error('Error al cargar documentos:', err),
    });
  }

  // Genera un token visual en el front (Mock)
  generateToken(documentId: string): string {
    const token = '123456';
    this.currentToken.set(token);
    this.currentDocumentId.set(documentId);
    console.log(`🔐 Token generado: ${token} para documento ${documentId}`);
    return token;
  }

  // Verifica el token local y avisa a Spring Boot que se firmó
  verifyAndSign(token: string): Observable<{ success: boolean; message: string }> {
    const activeToken = this.currentToken();
    const activeDocumentId = this.currentDocumentId();

    if (!activeToken || !activeDocumentId) {
      return of({ success: false, message: 'No hay un proceso de firma activo' });
    }

    if (token !== activeToken) {
      return of({ success: false, message: 'Token incorrecto' });
    }

    this.currentToken.set(null);
    this.currentDocumentId.set(null);

    // Llamamos al PATCH de Spring Boot
    return this.documentApi.signDocument(activeDocumentId).pipe(
      map((response) => {
        // Actualizamos localmente con la respuesta oficial
        const currentDocs = this.documents();
        const index = currentDocs.findIndex((d) => d.id === response.id);
        if (index !== -1) {
          const newDocs = [...currentDocs];
          newDocs[index] = response;
          this.documents.set(newDocs);
        }

        return { success: true, message: `✅ Documento firmado exitosamente` };
      }),
      catchError((error) => {
        console.error('Error al firmar:', error);
        return of({ success: false, message: 'Error al procesar la firma en el servidor.' });
      }),
    );
  }

  // Recibe el payload desde el modal y lo manda a Spring Boot
  addLocalDocument(payload: any): void {
    this.documentApi.postDocument(payload).subscribe({
      next: (savedDocument) => {
        this.documents.update((currentDocs) => [savedDocument, ...currentDocs]);
        console.log('📄 Documento creado en BD:', savedDocument);
      },
      error: (err) => console.error('Error al crear documento:', err),
    });
  }

  cancelSignature(): void {
    this.currentToken.set(null);
    this.currentDocumentId.set(null);
  }
}
