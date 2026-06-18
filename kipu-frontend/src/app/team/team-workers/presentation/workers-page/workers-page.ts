import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamWorkersStore } from '../../application/team-workers.store';
import { LogisticsStore } from '../../../../logistics/application/logistics.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkersAddWorker } from '../workers-add-worker/workers-add-worker';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix, MatPrefix } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-workers-page',
  imports: [
    TranslateModule,
    TranslatePipe,
    MatRipple,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './workers-page.html',
  styleUrl: './workers-page.css',
})
export class WorkersPage implements OnInit, OnDestroy {
  teamStore = inject(TeamWorkersStore);
  logisticsStore = inject(LogisticsStore);
  dialog = inject(MatDialog);

  private destroy$ = new Subject<void>();
  searchControl = new FormControl('');

  ngOnInit(): void {
    // Carga inicial
    this.teamStore.loadWorkers('');
    this.logisticsStore.loadMachinery();

    // Buscador interactivo hacia el backend
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.teamStore.loadWorkers(term || '');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  getMachineryNames(machineries: { machineryId: string; fullName: string }[]): string {
    return machineries.map((m) => m.fullName).join(', ');
  }

  openFormDialog() {
    const availableMachinery = this.logisticsStore
      .machinery()
      .filter((m) => m.status === 'AVAILABLE');

    const dialogRef = this.dialog.open(WorkersAddWorker, {
      width: '500px',
      disableClose: true,
      data: { machineryList: availableMachinery },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSaveWorker(result);
      }
    });
  }

  onSaveWorker(workerFormValue: any) {
    const currentProjectId = localStorage.getItem('currentProjectId');
    const selectedMachineries = workerFormValue.assignedTools || [];

    const machineriesPayload = selectedMachineries.map((m: any) => ({
      machineryId: m.id,
      fullName: m.name,
    }));

    const payload = {
      dni: workerFormValue.dni,
      fullName: workerFormValue.fullName,
      role: workerFormValue.role,
      projectId: currentProjectId,
      machineries: machineriesPayload,
    };

    this.teamStore.addWorker(payload);

    const today = new Date().toISOString().split('T')[0];
    selectedMachineries.forEach((machinery: any) => {
      this.logisticsStore.updateMachinery(machinery.id, {
        status: 'IN_USE',
        assignedTo: workerFormValue.fullName,
        registrationDate: today,
        assignmentDetail: `Assigned to worker ${workerFormValue.fullName}`,
      });
    });
  }

  deleteWorker(id: string) {
    const workerToRelease = this.teamStore.teamWorkers().find((w) => w.id === id);

    if (workerToRelease && workerToRelease.machineries && workerToRelease.machineries.length > 0) {
      workerToRelease.machineries.forEach((machine) => {
        this.logisticsStore.updateMachinery(machine.machineryId, {
          status: 'AVAILABLE',
          assignedTo: '',
          assignmentDetail: 'Machinery was deleted by user',
        });
      });
    }

    this.teamStore.deleteWorker(id);
  }
}
