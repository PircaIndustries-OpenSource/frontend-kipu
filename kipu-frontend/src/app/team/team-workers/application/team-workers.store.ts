import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { TeamWorkersApi } from '../infrastructure/team-workers.api';
import { TeamWorkersEntity, WorkerMachinery } from '../domain/model/team-workers.entity';
import { ProjectStateService } from '../../../shared/application/project-state.service';
import { CreateTeamWorkerRequest } from '../infrastructure/team-workers.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamWorkersStore {
  teamApi = inject(TeamWorkersApi);

  teamWorkersSignal = signal<TeamWorkersEntity[]>([]);
  readonly teamWorkers = computed(() => this.teamWorkersSignal());
  private projectsStore = inject(ProjectStateService);

  constructor() {
    effect(() => {
      const activeId = this.projectsStore.currentProjectId();
      if (activeId) {
        this.loadWorkers(true);
      } else {
        this.teamWorkersSignal.set([]);
      }
    });
  }

  loadWorkers(force = false) {
    if (force || this.teamWorkersSignal().length === 0) {
      this.teamApi.getAllWorkers().subscribe({
        next: (data) => this.teamWorkersSignal.set(data),
        error: (err) => console.error('Error loading workers:', err),
      });
    }
  }

  addWorker(worker: CreateTeamWorkerRequest): Observable<TeamWorkersEntity> {
    return this.teamApi.postWorker(worker);
  }

  assignMachinery(workerId: string, machineryId: string, fullName: string): Observable<TeamWorkersEntity> {
    return this.teamApi.assignMachinery(workerId, machineryId, fullName);
  }

  removeMachineryFromWorker(workerId: string, machineryId: string): Observable<TeamWorkersEntity> {
    return this.teamApi.removeMachinery(workerId, machineryId);
  }

  deleteWorker(id: string) {
    this.teamApi.deleteWorker(id).subscribe({
      next: () => {
        this.teamWorkersSignal.update((workers) => workers.filter((w) => w.id !== id));
      },
      error: (err) => console.error('Error deleting worker:', err),
    });
  }
}
