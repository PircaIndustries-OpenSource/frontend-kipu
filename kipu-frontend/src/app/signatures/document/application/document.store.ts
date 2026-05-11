// presentation/store/documents.store.ts
import { Injectable, signal } from '@angular/core';
import { DocumentEntity } from '../domain/model/document.entity';
import { DocumentApi } from '../infrastructure/document.api';
import { catchError, map, Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class DocumentsStore {
  private documents = signal<DocumentEntity[]>([]);
  private currentToken = signal<string | null>(null); // Token actual (solo en memoria)
  private currentDocumentId = signal<string | null>(null); // Documento que se está firmando

  readonly documents$ = this.documents.asReadonly();
  readonly currentToken$ = this.currentToken.asReadonly();

  constructor(private documentApi: DocumentApi) {}

  async loadAllDocuments(): Promise<void> {
    this.documentApi.getAllDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
      },
      error: (err) => {
        console.error('Error al cargar documentos:', err);
      },
    });
  }

  getSignedDocuments(): DocumentEntity[] {
    return this.documents().filter((doc) => doc.isSigned);
  }

  getPendingDocuments(): DocumentEntity[] {
    return this.documents().filter((doc) => !doc.isSigned);
  }

  getDocumentsByType(type: string): DocumentEntity[] {
    return this.documents().filter((doc) => doc.type === type);
  }

  generateToken(documentId: string): string {
    const token = '123456';
    this.currentToken.set(token);
    this.currentDocumentId.set(documentId);

    console.log(`🔐 Token generado: ${token} para documento ${documentId}`);
    return token;
  }

  verifyAndSign(token: string): Observable<{ success: boolean; message: string }> {
    const activeToken = this.currentToken();
    const activeDocumentId = this.currentDocumentId();

    if (!activeToken || !activeDocumentId) {
      return of({ success: false, message: 'No hay un proceso de firma activo' });
    }

    if (token !== activeToken) {
      return of({ success: false, message: 'Token incorrecto' });
    }

    const documentToUpdate = this.documents().find((d) => d.id === activeDocumentId);

    if (!documentToUpdate) {
      return of({ success: false, message: 'Documento no encontrado' });
    }

    if (documentToUpdate.isSigned) {
      return of({ success: false, message: 'Este documento ya está firmado' });
    }

    const updatedDocument = {
      ...documentToUpdate,
      isSigned: true,
      digitalSignatureToken: token,
    };

    this.currentToken.set(null);
    this.currentDocumentId.set(null);

    return this.documentApi.updateDocument(updatedDocument).pipe(
      map((response) => {
        const currentDocs = this.documents();
        const index = currentDocs.findIndex((d) => d.id === response.id);
        if (index !== -1) {
          const newDocs = [...currentDocs];
          newDocs[index] = response;
          this.documents.set(newDocs);
        }

        return {
          success: true,
          message: `✅ Documento firmado exitosamente`,
        };
      }),
      catchError((error) => {
        console.error('Error al actualizar:', error);
        return of({
          success: false,
          message: 'Error al guardar la firma: ' + (error.error?.message || error.message),
        });
      }),
    );
  }

  updateLocalDocument(updatedDocument: DocumentEntity): void {
    const currentDocs = this.documents();
    const index = currentDocs.findIndex((d) => d.id === updatedDocument.id);

    if (index !== -1) {
      const newDocs = [...currentDocs];
      newDocs[index] = updatedDocument;
      this.documents.set(newDocs);
    }
  }

  // application/document.store.ts
  addLocalDocument(document: DocumentEntity): void {
    // ✅ Guardar en la API primero
    this.documentApi.postDocument(document).subscribe({
      next: (savedDocument) => {
        // Después de guardar en la API, añadir al signal
        this.documents.update((currentDocs) => [...currentDocs, savedDocument]);
        console.log('📄 Documento guardado en API y añadido localmente:', savedDocument);
      },
      error: (err) => {
        console.error('Error al guardar documento en API:', err);
        // Fallback: solo añadir localmente
        this.documents.update((currentDocs) => [...currentDocs, document]);
      },
    });
  }

  cancelSignature(): void {
    this.currentToken.set(null);
    this.currentDocumentId.set(null);
    console.log('🔐 Proceso de firma cancelado');
  }

  hasActiveSignature(): boolean {
    return this.currentToken() !== null && this.currentDocumentId() !== null;
  }
}
