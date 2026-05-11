import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MachineryEntity } from '../../../domain/machinery.entity';

@Component({
  selector: 'app-machinery-history-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule, TranslatePipe],
  template: `
    <div class="p-2 flex flex-col gap-5">
      <h2 mat-dialog-title class="!text-2xl !font-bold text-slate-800 flex items-center gap-2">
        <mat-icon>history</mat-icon>
        {{ 'machinery.history.title' | translate }}
      </h2>
      <mat-dialog-content class="flex flex-col gap-4">
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p class="font-bold text-primary text-lg">{{ data.name }}</p>
          <p class="text-sm text-neutral-border">{{ 'machinery.history.current-status' | translate }}: {{ data.status }}</p>
        </div>
        <div class="flex flex-col gap-3">
          <h3 class="text-xs font-black text-primary uppercase tracking-widest">
            {{ 'machinery.history.assignment-log' | translate }}
          </h3>
          <div class="border border-neutral-border/20 rounded-m p-4 text-center text-sm text-neutral-border">
            <mat-icon class="text-3xl mb-2">info</mat-icon>
            <p>{{ 'machinery.history.no-records' | translate }}</p>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="!gap-3 !p-6">
        <button mat-button mat-dialog-close class="!rounded-md !px-6" type="button">
          {{ 'machinery.history.btn-close' | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class MachineryHistoryDialog {
  dialogRef = inject(MatDialogRef<MachineryHistoryDialog>);
  data: MachineryEntity = inject(MAT_DIALOG_DATA);
}
