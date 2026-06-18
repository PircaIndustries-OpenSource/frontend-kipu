import { computed, inject, Injectable, signal } from '@angular/core';
import { TeamWorkersApi } from '../infrastructure/team-workers.api';
import { TeamWorkersEntity } from '../domain/model/team-workers.entity';

@Injectable({
  providedIn: 'root',
})
export class TeamWorkersStore {
  teamApi = inject(TeamWorkersApi);

  private teamWorkersSignal = signal<TeamWorkersEntity[]>([]);
  readonly teamWorkers = computed(() => this.teamWorkersSignal());

  loadWorkers(searchTerm: string = '') {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) return;

    this.teamApi.getAllWorkers(projectId, searchTerm).subscribe({
      next: (data) => this.teamWorkersSignal.set(data),
      error: (err) => console.error('Error cargando Team Workers', err),
    });
  }

  addWorker(payload: any) {
    this.teamApi.postWorker(payload).subscribe({
      next: (newWorker) => {
        this.teamWorkersSignal.update((prev) => [...prev, newWorker]);
      },
      error: (error) => console.error('Error creando Worker', error),
    });
  }

  deleteWorker(id: string) {
    this.teamApi.deleteWorker(id).subscribe({
      next: () => {
        this.teamWorkersSignal.update((workers) => workers.filter((worker) => worker.id !== id));
      },
      error: (err) => console.error('Error eliminando Worker', err),
    });
  }

  assignMachineryToWorker(teamWorkerId: string, machineryId: string, machineryName: string) {
    const payload = {
      machineryId: machineryId,
      fullName: machineryName,
    };

    this.teamApi.assignMachinery(teamWorkerId, payload).subscribe({
      next: (updatedWorker) => {
        this.teamWorkersSignal.update((workers) =>
          workers.map((worker) => (worker.id === updatedWorker.id ? updatedWorker : worker)),
        );
        console.log(`✅ Maquinaria '${machineryName}' asignada exitosamente al trabajador.`);
      },
      error: (err) => {
        console.error('⚠️ Error al asignar maquinaria al trabajador', err);
      },
    });
  }
}
