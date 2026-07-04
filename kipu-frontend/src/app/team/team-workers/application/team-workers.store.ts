import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { TeamWorkersApi } from '../infrastructure/team-workers.api';
import { TeamWorkersEntity } from '../domain/model/team-workers.entity';
import { ProjectStateService } from '../../../shared/application/project-state.service';
import { CreateTeamWorkerRequest } from '../infrastructure/team-workers.response';
import { Observable, of, tap, catchError } from 'rxjs';

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

  reloadWorkers(): Observable<TeamWorkersEntity[]> {
    return this.teamApi.getAllWorkers().pipe(
      tap((data) => this.teamWorkersSignal.set(data)),
      catchError((err) => {
        console.error('Error reloading workers:', err);
        return of(this.teamWorkersSignal());
      }),
    );
  }

  addWorker(worker: CreateTeamWorkerRequest): Observable<TeamWorkersEntity> {
    return this.teamApi.postWorker(worker).pipe(
      tap((newWorker) => {
        this.teamWorkersSignal.update((prev) => [...prev, newWorker]);
      }),
    );
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
