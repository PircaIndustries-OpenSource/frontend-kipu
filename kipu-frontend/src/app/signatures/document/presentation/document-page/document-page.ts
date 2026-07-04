import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DocumentsStore } from '../../application/document.store';
import { DocumentEntity } from '../../domain/model/document.entity';
import { SignatureComponent } from '../signature-component/signature-component';
import { SignatureAddComponent } from '../signature-add/signature-add';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { DossierExportService } from '../../application/dossier-export.service';
import { ProjectStateService } from '../../../../shared/application/project-state.service';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';

@Component({
  selector: 'app-document-page',
  imports: [MatIcon, TranslatePipe, DatePipe, MatButtonModule, MatSnackBarModule],
  templateUrl: './document-page.html',
  styleUrl: './document-page.css',
})
export class DocumentPage implements OnInit {
  private documentsStore = inject(DocumentsStore);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private dossierExportService = inject(DossierExportService);
  private projectStateService = inject(ProjectStateService);
  private snackBar = inject(MatSnackBar);
  private teamUsersStore = inject(TeamUsersStore);

  pendingDocuments: DocumentEntity[] = [];
  signedDocuments: DocumentEntity[] = [];
  pendingCount = 0;
  signedCount = 0;

  constructor() {
    effect(() => {
      const docs = this.documentsStore.documents$();
      const currentUserId = this.teamUsersStore.currentUser()?.id;
      const myDocs = currentUserId
        ? docs.filter((d) => d.assignedTo.some((s) => s.id === currentUserId))
        : docs;
      this.pendingDocuments = myDocs.filter((d) => !d.isSigned);
      this.signedDocuments = myDocs.filter((d) => d.isSigned);
      this.pendingCount = this.pendingDocuments.length;
      this.signedCount = this.signedDocuments.length;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.documentsStore.loadAllDocuments();
  }

  openCreateDocumentDialog() {
    const dialogRef = this.dialog.open(SignatureAddComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.documentsStore.addLocalDocument(result.document);
        this.snackBar.open('Documento creado exitosamente', 'Cerrar', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  async openSignatureDialog(document: DocumentEntity) {
    const codeSent = await this.documentsStore.sendSignCode(document.id);

    if (!codeSent) {
      this.snackBar.open('Error al enviar el código de verificación', 'Cerrar', { duration: 4000 });
      return;
    }

    const dialogRef = this.dialog.open(SignatureComponent, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.snackBar.open('Documento firmado exitosamente', 'Cerrar', { duration: 3000 });
        this.documentsStore.loadAllDocuments();
      } else if (result?.error) {
        this.snackBar.open(result.error, 'Cerrar', { duration: 4000 });
      }
    });
  }

  hasUserSigned(document: DocumentEntity): boolean {
    const currentUserId = this.teamUsersStore.currentUser()?.id;
    if (!currentUserId) return false;
    return document.assignedTo.some((s) => s.id === currentUserId && s.signedAt != null);
  }

  getSignersNames(document: DocumentEntity): string {
    if (!document.assignedTo || document.assignedTo.length === 0) {
      return 'Sin firmantes asignados';
    }
    return document.assignedTo.map((signer) => signer.fullName).join(', ');
  }

  getLastSignedDate(document: DocumentEntity): Date {
    const signedSigners = document.assignedTo?.filter((s) => s.signedAt) || [];
    if (signedSigners.length === 0) return new Date();
    return new Date(Math.max(...signedSigners.map((s) => new Date(s.signedAt!).getTime())));
  }

  exportDossier() {
    const projectName = this.projectStateService.currentProjectName() || 'Proyecto General';
    const signaturesList: any[] = [];
    this.signedDocuments.forEach((doc) => {
      const signedSigners = doc.assignedTo?.filter((s) => s.signedAt) || [];
      signedSigners.forEach((signer) => {
        signaturesList.push({
          date: signer.signedAt,
          documentName: doc.type,
          userName: signer.fullName,
          hashSignature: doc.digitalSignatureToken || 'e3b0c44298f...',
        });
      });
    });
    this.dossierExportService.exportDossierPdf(projectName, 'Firma Digital', signaturesList);
  }
}
