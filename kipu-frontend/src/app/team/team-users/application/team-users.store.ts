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
    () => this.teamUsers().filter((user) => user.isActive && user.role == 'Gestor Operativo').length,
  );
  readonly totalLogistics = computed(
    () => this.teamUsers().filter((user) => user.isActive && user.role == 'Logística').length,
  );

  getRoleTranslation(role: string): string {
    const translationMap: Record<string, string> = {
      Administrador: this.translate.instant('team.users.role-dictionary.administrator'),
      'Gestor Operativo': this.translate.instant('team.users.role-dictionary.manager'),
      Logística: this.translate.instant('team.users.role-dictionary.logistics'),
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
        const stored = localStorage.getItem('currentUser');
        let currentEmail = '';
        if (stored) {
          const identity = JSON.parse(stored);
          currentEmail = identity.email || '';
        }
        const filtered = currentEmail
          ? users.filter((u) => u.email !== currentEmail)
          : users;
        this.teamUsersSignal.set(filtered);

        const myRecord = users.find((u) => u.email === currentEmail);
        if (myRecord) {
          this.currentUserSignal.set(myRecord);
        }
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
    const nameParts = (userData.fullName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const invitation = {
      email: userData.email,
      firstName: firstName,
      lastName: lastName,
      role: userData.role,
      projectId: projectId,
      status: 'PENDING',
    };

    this.teamApi.postInvitation(invitation).subscribe({
      next: () => {
        console.log('Invitación enviada a:', userData.email);
      },
      error: (err) => console.error('Error al enviar invitación:', err),
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
