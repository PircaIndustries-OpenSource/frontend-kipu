import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-rnc-status-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, TranslateModule],
  templateUrl: './rnc-status-dialog.component.html',
})
export class RncStatusDialogComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RncStatusDialogComponent>);

  // Internal state variables for the form
  statusOption: string = 'Solved';
  severityOption: string = 'Low';

  ngOnInit() {
    // Initialize component state from passed data
    this.statusOption = this.data.currentStatus === 'Solved' ? 'Solved' : 'Unsolved';
    this.severityOption = this.data.currentSeverity || 'Low';
  }

  /**
   * Confirm selection and pass data back to parent component.
   */
  confirm() {
    this.dialogRef.close({
      status: this.statusOption,
      severity: this.severityOption,
    });
  }
}
