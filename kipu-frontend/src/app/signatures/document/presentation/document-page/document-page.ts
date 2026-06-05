import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentsStore } from '../../application/document.store';
import { DocumentEntity } from '../../domain/model/document.entity';
import { SignatureComponent } from '../signature-component/signature-component';
import { SignatureAddComponent } from '../signature-add/signature-add'; // ✅ Para CREAR documento
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DossierExportService } from '../../application/dossier-export.service';
import { ProjectStateService } from '../../../../shared/application/project-state.service';

@Component({
  selector: 'app-document-page',
  imports: [MatIcon, TranslatePipe, DatePipe, MatButtonModule, MatTooltipModule],
  templateUrl: './document-page.html',
  styleUrl: './document-page.css',
})
export class DocumentPage implements OnInit {
  private documentsStore = inject(DocumentsStore);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private dossierExportService = inject(DossierExportService);
  private projectStateService = inject(ProjectStateService);

  pendingDocuments: DocumentEntity[] = [];
  signedDocuments: DocumentEntity[] = [];
  pendingCount = 0;
  signedCount = 0;

  constructor() {
    effect(() => {
      const docs = this.documentsStore.documents$();
      this.pendingDocuments = docs.filter((d) => !d.isSigned);
      this.signedDocuments = docs.filter((d) => d.isSigned);
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
        console.log('Nuevo documento creado:', result.document);
        this.documentsStore.addLocalDocument(result.document);
        this.cdr.detectChanges();
      }
    });
  }

  openSignatureDialog(document: DocumentEntity) {
    const token = this.documentsStore.generateToken(document.id);
    console.log(`[SIMULACIÓN] Token para ${document.type}: ${token}`);

    const dialogRef = this.dialog.open(SignatureComponent, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.documentsStore.loadAllDocuments();


      }

    });
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
    const stageName = 'Fase de Control de Calidad';
    
    // Compile signatures history from all signed documents
    const signaturesList: any[] = [];
    this.signedDocuments.forEach(doc => {
      const signedSigners = doc.assignedTo?.filter(s => s.signedAt) || [];
      signedSigners.forEach(signer => {
        signaturesList.push({
          date: signer.signedAt,
          documentName: doc.type,
          userName: signer.fullName,
          userRole: (signer as any).role || 'Ingeniero',
          hashSignature: doc.digitalSignatureToken || 'e3b0c44298f...'
        });
      });
    });

    this.dossierExportService.exportDossierPdf(projectName, stageName, signaturesList);
  }
}
