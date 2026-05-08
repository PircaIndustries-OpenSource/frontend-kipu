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
}
