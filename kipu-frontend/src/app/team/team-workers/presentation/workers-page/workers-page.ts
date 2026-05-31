import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core'; // Añadido TranslateModule si usas directivas
import { MatRipple } from '@angular/material/core';
import { TeamWorkersStore } from '../../application/team-workers.store';
import { LogisticsStore } from '../../../../logistics/application/logistics.store';
import { inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkersAddWorker } from '../workers-add-worker/workers-add-worker';

// IMPORTS EXACTOS DEL BUSCADOR DE USERS
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix, MatPrefix } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-workers-page',
  imports: [
    TranslateModule,
    TranslatePipe,
    MatRipple,
    MatDialogModule,
    ReactiveFormsModule, // Requerido para formControl
    MatFormField, // Componentes de Material
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './workers-page.html',
  styleUrl: './workers-page.css',
})
export class WorkersPage implements OnInit {
  teamStore: TeamWorkersStore = inject(TeamWorkersStore);
  logisticsStore: LogisticsStore = inject(LogisticsStore);
  dialog = inject(MatDialog);

  // CONTROL REACTIVO IGUAL AL DE USERS
  searchControl = new FormControl('');

  // FILTRADO REACTIVO EN TIEMPO REAL
  get filteredWorkers() {
    const query = (this.searchControl.value || '').trim().toLowerCase();
    const allWorkers = this.teamStore.teamWorkers();

    if (!query) {
      return allWorkers;
    }

    return allWorkers.filter(
      (w) => w.fullName.toLowerCase().includes(query) || w.dni.includes(query),
    );
  }

  // MÉTODO PARA LIMPIAR EL INPUT
  clearSearch() {
    this.searchControl.setValue('');
  }

  ngOnInit(): void {
    this.teamStore.loadWorkers();
    this.logisticsStore.loadMachinery();
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
    const selectedMachineries = workerFormValue.assignedTools || [];
    const assignedToolNames = selectedMachineries.map((m: any) => m.name);

    const workerDTO = {
      id: `w-${Date.now()}`,
      dni: workerFormValue.dni,
      fullName: workerFormValue.fullName,
      role: workerFormValue.role,
      status: workerFormValue.status,
      assignedTools: assignedToolNames,
    };

    this.teamStore.addWorker(workerDTO);

    const today = new Date().toISOString().split('T')[0];

    selectedMachineries.forEach((machinery: any) => {
      this.logisticsStore.updateMachinery(machinery.id, {
        status: 'IN_USE',
        assignedTo: workerDTO.fullName,
        registrationDate: today,
        assignmentDetail: `Asignado al operador ${workerDTO.fullName}`,
      });
    });
  }

  deleteWorker(id: string) {
    const workerToRelease = this.teamStore.teamWorkers().find((w) => w.id === id);

    if (
      workerToRelease &&
      workerToRelease.assignedTools &&
      workerToRelease.assignedTools.length > 0
    ) {
      workerToRelease.assignedTools.forEach((toolName: string) => {
        const machineryItem = this.logisticsStore.machinery().find((m) => m.name === toolName);

        if (machineryItem) {
          this.logisticsStore.updateMachinery(machineryItem.id, {
            status: 'AVAILABLE',
            assignedTo: '',
            assignmentDetail: 'Maquinaria liberada por eliminación de operador',
          });
        }
      });
    }

    this.teamStore.deleteWorker(id);
  }
}
