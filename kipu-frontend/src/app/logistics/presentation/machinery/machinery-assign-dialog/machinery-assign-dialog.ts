import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { TeamWorkersStore } from '../../../../team/team-workers/application/team-workers.store';

@Component({
  selector: 'app-machinery-assign-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslatePipe,
  ],
  template: `
    <div [formGroup]="assignForm" class="p-2 flex flex-col gap-5">
      <h2 mat-dialog-title class="text-2xl! font-bold! text-slate-800">
        {{ 'machinery.assign.title' | translate }}
      </h2>
      <mat-dialog-content class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full pt-3!">
          <mat-label>{{ 'machinery.assign.worker-label' | translate }}</mat-label>
          <mat-select formControlName="workerDni">
            @for (w of workerList(); track w.id) {
              <mat-option [value]="w.dni">{{ w.dni }} - {{ w.fullName }}</mat-option>
            }
          </mat-select>
          @if (
            assignForm.get('workerDni')?.hasError('required') &&
            assignForm.get('workerDni')?.touched
          ) {
            <mat-error>{{ 'machinery.assign.worker-required' | translate }}</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="gap-3! p-6!">
        <button mat-button (click)="onCancel()" class="rounded-md! px-6!" type="button">
          {{ 'machinery.assign.btn-cancel' | translate }}
        </button>
        <button
          mat-flat-button
          color="primary"
          class="bg-accent rounded-md! px-6! shadow-lg shadow-blue-200"
          (click)="onAssign()"
          type="button"
        >
          {{ 'machinery.assign.btn-assign' | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class MachineryAssignDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineryAssignDialog>);
  workersStore = inject(TeamWorkersStore);

  workerList = this.workersStore.teamWorkers;
  assignForm: FormGroup = this.fb.group({
    workerDni: ['', Validators.required],
  });

  ngOnInit() {
    this.workersStore.loadWorkers();
  }

  onAssign() {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }
    const worker = this.workerList().find((w) => w.dni === this.assignForm.value.workerDni);
    this.dialogRef.close({
      workerDni: this.assignForm.value.workerDni,
      workerName: worker?.fullName ?? '',
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
