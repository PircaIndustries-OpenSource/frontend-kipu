import { Injectable, signal, effect, inject } from '@angular/core';
import { DocumentEntity } from '../domain/model/document.entity';
import { DocumentApi } from '../infrastructure/document.api';
import { AuthStore } from '../../../identity/application/auth.store';
import { ProjectsStore } from '../../../projects/application/projects.store';
import { TeamUsersStore } from '../../../team/team-users/application/team-users.store';

@Injectable({ providedIn: 'root' })
export class DocumentsStore {
  private documents = signal<DocumentEntity[]>([]);
  private currentDocumentId = signal<string | null>(null);

  readonly documents$ = this.documents.asReadonly();

  private authStore = inject(AuthStore);
  private projectsStore = inject(ProjectsStore);
  private teamUsersStore = inject(TeamUsersStore);

  constructor(private documentApi: DocumentApi) {
    effect(() => {
      const activeId = this.projectsStore.currentProjectId();
      if (activeId) {
        this.loadAllDocuments();
      } else {
        this.documents.set([]);
      }
    });
  }

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

  sendSignCode(documentId: string): Promise<boolean> {
    const email = this.authStore.currentUser()?.email || '';
    const teamUserId = this.teamUsersStore.currentUser()?.id || '';
    if (!email || !teamUserId) return Promise.resolve(false);

    this.currentDocumentId.set(documentId);

    return new Promise((resolve) => {
      this.documentApi.sendSignCode(documentId, email, teamUserId).subscribe({
        next: () => resolve(true),
        error: () => resolve(false),
      });
    });
  }

  verifyAndSign(code: string): Promise<{ success: boolean; message: string }> {
    const docId = this.currentDocumentId();
    const user = this.authStore.currentUser();
    const teamUserId = this.teamUsersStore.currentUser()?.id || '';

    if (!docId || !user || !teamUserId) {
      return Promise.resolve({ success: false, message: 'No hay un proceso de firma activo' });
    }

    return new Promise((resolve) => {
      this.documentApi.signDocument(docId, code, user.email || '', teamUserId, user.name || '').subscribe({
        next: (updatedDoc) => {
          this.documents.update((docs) =>
            docs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
          );
          this.currentDocumentId.set(null);
          resolve({ success: true, message: 'Documento firmado exitosamente' });
        },
        error: (err) => {
          const message = err.error?.message || err.error?.detail || 'Error al verificar el código';
          resolve({ success: false, message });
        },
      });
    });
  }

  cancelSignature(): void {
    this.currentDocumentId.set(null);
  }

  addLocalDocument(document: DocumentEntity): void {
    this.documentApi.postDocument(document).subscribe({
      next: (saved) => {
        this.documents.update((current) => [...current, saved]);
      },
      error: (err) => {
        console.error('Error al guardar documento:', err);
        this.documents.update((current) => [...current, document]);
      },
    });
  }
}
