import { Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DocumentsStore } from '../../application/document.store';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormField, MatHint, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-signature-component',
  imports: [
    TranslatePipe,
    MatFormField,
    MatDialogContent,
    MatIcon,
    MatLabel,
    FormsModule,
    MatHint,
    MatDialogActions,
    MatDialogClose,
    MatButton,
  ],
  templateUrl: './signature-component.html',
  styleUrl: './signature-component.css',
})
export class SignatureComponent {
  private dialogRef = inject(MatDialogRef<SignatureComponent>);
  private documentsStore = inject(DocumentsStore);

  tokenInput: string = '';

  async onConfirm() {
    const result = await this.documentsStore.verifyAndSign(this.tokenInput);

    if (result.success) {
      this.dialogRef.close({ success: true, message: result.message });
    } else {
      this.dialogRef.close({ success: false, error: result.message });
    }
  }
}
