import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TeamUsersStore } from '../../../team/team-users/application/team-users.store';

@Component({
  selector: 'app-rnc-action-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, TranslateModule],
  templateUrl: './rnc-action-dialog.component.html',
})
export class RncActionDialogComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RncActionDialogComponent>);
  teamUsersStore = inject(TeamUsersStore);

  inputValue: string = '';
  selectionValue: string = 'Low';
  statusValue: string = 'Created';
  statusOption: string = 'Solved';
  severityOption: string = 'Low';
  notesOption: string = '';

  ngOnInit() {
    this.selectionValue = this.data.currentSeverity || 'Low';
    this.inputValue = this.data.currentNotes || '';
  }

  updateMode() {
    if (this.statusValue === 'Unsolved') {
      this.statusValue = 'Created';
    }
  }

  confirm() {
    // We send back the selected severity, the notes, and explicitly signal if it should be 'Solved'
    this.dialogRef.close({
      severity: this.selectionValue,
      value: this.inputValue,
      status: this.selectionValue === 'Solved' ? 'Solved' : this.data.currentStatus,
    });
  }
}
