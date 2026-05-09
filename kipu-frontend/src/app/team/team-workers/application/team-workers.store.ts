import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TeamWorkersApi } from '../infrastructure/team-workers.api';
import { TeamWorkersEntity } from '../domain/model/team-workers.entity';

@Injectable({
  providedIn: 'root',
})
export class TeamWorkersStore {
  teamApi = inject(TeamWorkersApi);
  private translate = inject(TranslateService);

  private teamWorkersSignal = signal<TeamWorkersEntity[]>([]);
  readonly teamWorkers = computed(() => this.teamWorkersSignal());

  loadWorkers() {
    if (this.teamWorkersSignal().length == 0) {
      this.teamApi.getAllWorkers().subscribe((data) => {
        this.teamWorkersSignal.set(data);
      });
    }
  }
  deleteWorker(id: string) {
    this.teamApi.deleteWorker(id).subscribe({
      next: () => {
        this.teamWorkersSignal.update(workers =>
        workers.filter(worker => worker.id !== id))
      },
      error: (err) => console.log(err)
    });
  }
  addWorker(worker: TeamWorkersEntity) {
    this.teamApi.postWorker(worker).subscribe({
      next: (newWorker) => {
        this.teamWorkersSignal.update(prev => [...prev, newWorker]);
      },
      error: (error) => console.log(error)
    });
  }
}
