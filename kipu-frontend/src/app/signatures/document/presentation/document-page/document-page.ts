import { Component, effect, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentsStore } from '../../application/document.store';
import { DocumentEntity } from '../../domain/model/document.entity';
import { toObservable } from '@angular/core/rxjs-interop';
import { SignatureComponent } from '../signature-component/signature-component';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-document-page',
  imports: [MatIcon, TranslatePipe, DatePipe],
  templateUrl: './document-page.html',
  styleUrl: './document-page.css',
})
export class DocumentPage implements OnInit {
  private documentsStore = inject(DocumentsStore);
  private dialog = inject(MatDialog);

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
    });
  }

  ngOnInit() {
    this.documentsStore.loadAllDocuments();
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
    return document.assignedTo.map((signer) => signer.fullName).join(', ');
  }

  getLastSignedDate(document: DocumentEntity): Date {
    const signedSigners = document.assignedTo.filter((s) => s.signedAt);
    if (signedSigners.length === 0) return new Date();
    return new Date(Math.max(...signedSigners.map((s) => new Date(s.signedAt!).getTime())));
  }
}
