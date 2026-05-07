import { computed, inject, Injectable, signal } from '@angular/core';
import { TeamUsersEntity } from '../domain/team-users.entity';
import { TeamWorkersEntity } from '../domain/team-workers.entity';
import { TeamApi } from '../infrastructure/team.api';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root',
})
export class TeamStore {
  teamApi = inject(TeamApi);
  private translate = inject(TranslateService);

  // USERS
  private teamUsersSignal = signal<TeamUsersEntity[]>([]);
  private searchTermSignal = signal<string>('');
  readonly teamUsers = computed(() => this.teamUsersSignal());
  readonly filteredUsers = computed(() => {
    const users = this.teamUsers();
    const searchTeam = this.searchTermSignal().toLowerCase().trim();

    if (!searchTeam || searchTeam === '' || searchTeam === null || searchTeam === undefined)
      return users;

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTeam) ||
        user.email.toLowerCase().includes(searchTeam) ||
        this.getRoleTranslation(user.role).toLowerCase().includes(searchTeam) ||
        (user.isActive ? 'activo' : 'inactivo').includes(searchTeam),
    );
  });
  readonly totalActiveUsers = computed(
    () => this.teamUsers().filter((user) => user.isActive).length,
  );
  readonly totalManagers = computed(
    () => this.teamUsers().filter((user) => user.isActive && user.role == 'Gestor').length,
  );
  readonly totalLogistics = computed(
    () => this.teamUsers().filter((user) => user.isActive && user.role == 'Logistica').length,
  );
  readonly totalClients = computed(
    () => this.teamUsers().filter((user) => user.isActive && user.role == 'Cliente').length,
  );

  getRoleTranslation(role: string): string {
    const translationMap: Record<string, string> = {
      Administrador: this.translate.instant('team.users.role-dictionary.administrator'),
      Gestor: this.translate.instant('team.users.role-dictionary.manager'),
      Logistica: this.translate.instant('team.users.role-dictionary.logistics'),
      Cliente: this.translate.instant('team.users.role-dictionary.client'),
      Ingeniero: this.translate.instant('team.users.role-dictionary.engineer'),
    };
    return translationMap[role] || role;
  }

  loadUsers() {
    if (this.teamUsersSignal().length == 0) {
      this.teamApi.getAllUsers().subscribe((data) => {
        this.teamUsersSignal.set(data);
      });
    }
  }

  updateSearchTerm(term: string) {
    this.searchTermSignal.set(term);
  }

  cleanSearch() {
    this.searchTermSignal.set('');
  }

  createUser(fullName: string, email: string, rol: string): TeamUsersEntity {
    return {
      id: `us-${Date.now()}`,
      fullName: fullName,
      email: email,
      isActive: true,
      role: rol,
    };
  }
  inviteUser(user: TeamUsersEntity){
    const currentUsers = this.teamUsersSignal();
    this.teamUsersSignal.set([...currentUsers, user]);

    this.teamApi.postUser(user);

  }

  // WORKERS

  private teamWorkersSignal = signal<TeamWorkersEntity[]>([]);
  readonly teamWorkers = computed(() => this.teamWorkersSignal());
}
