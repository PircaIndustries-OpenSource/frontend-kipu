import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamWorkersStore } from '../../application/team-workers.store';
import { LogisticsStore } from '../../../../logistics/application/logistics.store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkersAddWorker } from '../workers-add-worker/workers-add-worker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { TeamWorkersEntity } from '../../domain/model/team-workers.entity';
import { ConfirmDialog } from '../../../../shared/presentation/confirm-dialog/confirm-dialog';

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
    MatSnackBarModule,
  ],
  templateUrl: './workers-page.html',
  styleUrl: './workers-page.css',
})
export class WorkersPage implements OnInit {
  teamStore: TeamWorkersStore = inject(TeamWorkersStore);
  logisticsStore: LogisticsStore = inject(LogisticsStore);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  searchControl = new FormControl('');

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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      'Administrador': 'bg-purple-100 text-purple-700',
      'Logística': 'bg-blue-100 text-blue-700',
      'Gestor Operativo': 'bg-green-100 text-green-700',
    };
    return map[role] || 'bg-gray-100 text-gray-700';
  }

  getRoleTranslation(role: string): string {
    const map: Record<string, string> = {
      'Administrador': 'Administrador',
      'Logística': 'Logística',
      'Gestor Operativo': 'Gestor Operativo',
    };
    return map[role] || role;
  }

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
    const projectId = localStorage.getItem('currentProjectId') || '';

    const selectedMachineries = workerFormValue.assignedTools || [];
    const machineriesPayload = selectedMachineries.map((m: any) => ({
      machineryId: m.id,
      fullName: m.name,
    }));

    const workerDTO = {
      dni: workerFormValue.dni,
      fullName: workerFormValue.fullName,
      role: workerFormValue.role,
      projectId: projectId,
      machineries: machineriesPayload,
    };

    this.teamStore.addWorker(workerDTO).subscribe({
      next: (newWorker) => {
        const syncCalls = selectedMachineries.map((machinery: any) =>
          this.logisticsStore.updateMachinery(machinery.id, {
            status: 'IN_USE',
            assignedTo: newWorker.fullName,
            assignedWorkerId: newWorker.id,
            assignmentDetail: `Asignado al operador ${newWorker.fullName}`,
          })
        );
        forkJoin(syncCalls).subscribe({
          next: () => {
            this.teamStore.loadWorkers(true);
            this.logisticsStore.loadMachinery(true);
            this.snackBar.open('Trabajador creado y maquinaria asignada', 'Cerrar', { duration: 3000 });
          },
        });
      },
      error: (err) => {
        console.error('Error creating worker:', err);
        this.snackBar.open('Error al crear trabajador', 'Cerrar', { duration: 4000 });
      },
    });
  }

  deleteWorker(worker: TeamWorkersEntity) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar trabajador',
        subtitle: `¿Estás seguro de eliminar a ${worker.fullName}?`,
        confirmText: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      const todelMachineries = worker.machineries || [];
      const returnCalls = todelMachineries.map((m) =>
        this.logisticsStore.updateMachinery(m.machineryId, {
          status: 'AVAILABLE',
          assignedTo: '',
          assignedWorkerId: '',
          assignmentDetail: 'Maquinaria liberada por eliminación de operador',
        })
      );

      forkJoin(returnCalls).subscribe({
        next: () => {
          this.logisticsStore.loadMachinery(true);
          this.teamStore.deleteWorker(worker.id);
          this.snackBar.open('Trabajador eliminado y maquinaria liberada', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.teamStore.deleteWorker(worker.id);
        },
      });
    });
  }
}
