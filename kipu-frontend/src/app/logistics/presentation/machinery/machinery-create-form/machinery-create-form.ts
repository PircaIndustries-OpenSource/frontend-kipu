import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { TeamWorkersStore } from '../../../../team/team-workers/application/team-workers.store';
import { LogisticsStore } from '../../../application/logistics.store';

@Component({
  selector: 'app-machinery-create-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './machinery-create-form.html',
})
export class MachineryCreateForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MachineryCreateForm>);
  workersStore = inject(TeamWorkersStore);
  logisticsStore = inject(LogisticsStore);

  workerList = this.workersStore.teamWorkers;
  catalogList = this.logisticsStore.machineryCatalog;

  machineryForm: FormGroup = this.fb.group({
    selectedCatalogItem: [null, Validators.required],
    assignedTo: [''],
    assignmentDetail: ['', Validators.required],
  });

  ngOnInit() {
    this.workersStore.loadWorkers();
    this.logisticsStore.loadMachineryCatalog();
  }

  onSave() {
    if (this.machineryForm.invalid) {
      this.machineryForm.markAllAsTouched();
      return;
    }
    const formValue = this.machineryForm.value;
    const catalogItem = formValue.selectedCatalogItem;
    const worker = this.workerList().find((w) => w.dni === formValue.assignedTo);
    this.dialogRef.close({
      name: catalogItem.name,
      assignedTo: worker ? `${worker.dni} - ${worker.fullName}` : formValue.assignedTo,
      assignmentDetail: formValue.assignmentDetail,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
