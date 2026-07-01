import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamUsersApi } from '../infrastructure/team-users.api';
import { TranslateService } from '@ngx-translate/core';
import { Identity } from '../../../identity/domain/identity.model';
import { TeamUsersAssembler } from '../infrastructure/team-users.assembler';
import { ProjectStateService } from '../../../shared/application/project-state.service';


@Injectable({
  providedIn: 'root',
})
export class TeamUsersStore {
  teamApi = inject(TeamUsersApi);
  private translate = inject(TranslateService);
  private projectStateService = inject(ProjectStateService);

  private teamUsersSignal = signal<TeamUsersEntity[]>([]);
  private searchTermSignal = signal<string>('');
  private currentUserSignal = signal<TeamUsersEntity>(new TeamUsersEntity());
  readonly teamUsers = computed(() => this.teamUsersSignal());
  readonly currentUser = computed(() => this.currentUserSignal());
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
    () => this.teamUsers().filter((user) => user.isActive && user.role == 'Gestor'
    || user.role == "Gestor Operativo").length,
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

  constructor() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const identity = JSON.parse(stored);
      this.currentUserSignal.set(TeamUsersAssembler.toEntityFromIdentity(identity));
    }

    effect(() => {
      const activeId = this.projectStateService.currentProjectId();
      if (activeId) {
        this.loadTeamUsers(activeId);
      } else {
        this.teamUsersSignal.set([]);
      }
    });
  }

  loadTeamUsers(projectId: string) {
    this.teamApi.getTeamUsersByProject(projectId).subscribe({
      next: (users) => {
        const currentUserEmail = this.currentUser().email;
        const filtered = currentUserEmail
          ? users.filter((u) => u.email !== currentUserEmail)
          : users;
        this.teamUsersSignal.set(filtered);
      },
      error: (err) => console.error('Error loading team users:', err),
    });
  }

  loadIamUsers(): Observable<Identity[]> {
    return this.teamApi.getAllIamUsers();
  }

  updateSearchTerm(term: string) {
    this.searchTermSignal.set(term);
  }

  cleanSearch() {
    this.searchTermSignal.set('');
  }

  inviteUser(userData: any) {
    const projectId = this.projectStateService.currentProjectId() || '1';

    const teamUserToSave = {
      userId: userData.userId,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      projectId: projectId,
    };

    this.teamApi.createTeamUser(teamUserToSave).subscribe({
      next: (newUser) => {
        const entity = TeamUsersAssembler.toEntityFromResource(newUser);
        this.teamUsersSignal.update((prev) => [...prev, entity]);
      },
      error: (err) => console.error('Error al invitar:', err),
    });
  }

  toggleUserStatus(user: TeamUsersEntity) {
    const request = user.isActive
      ? this.teamApi.deactivateTeamUser(user.id)
      : this.teamApi.activateTeamUser(user.id);

    request.subscribe({
      next: (savedUser) => {
        this.teamUsersSignal.update((users) =>
          users.map((u) => (u.id === savedUser.id ? savedUser : u)),
        );
      },
      error: (err) => console.error('Error al actualizar estado:', err),
    });
  }


}
