import { computed, inject, Injectable, signal } from '@angular/core';
import { TeamUsersEntity } from '../domain/team-users.entity';
import { TeamWorkersEntity } from '../domain/team-workers.entity';
import { TeamApi } from '../infrastructure/team.api';

@Injectable({
  providedIn: 'root',
})
export class TeamStore {
  teamApi = inject(TeamApi);

  // USERS
  private teamUsersSignal = signal<TeamUsersEntity[]>([]);
  readonly teamUsers = computed(() => this.teamUsersSignal());
  readonly totalActiveUsers = computed(
    () => this.teamUsers().filter((user) => user.isActive).length,
  );
  readonly totalManagers = computed(() =>
    this.teamUsers().filter((user) => user.isActive && user.role == 'Gestor').length
  );
  readonly totalLogistics = computed(() =>
    this.teamUsers().filter((user) => user.isActive && user.role == 'Logistica').length
  );
  readonly totalClients = computed(() =>
    this.teamUsers().filter((user) => user.isActive && user.role == 'Cliente').length
  );

  loadUsers() {
    if (this.teamUsersSignal().length == 0) {
      this.teamApi.getAllUsers().subscribe((data) => {
        this.teamUsersSignal.set(data);
      })
    }
  }

  // WORKERS

  private teamWorkersSignal = signal<TeamWorkersEntity[]>([]);
  readonly teamWorkers = computed(() => this.teamWorkersSignal());
  

}
