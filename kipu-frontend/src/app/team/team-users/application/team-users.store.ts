import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamWorkersEntity } from '../../team-workers/domain/model/team-workers.entity';
import { TeamUsersApi } from '../infrastructure/team-users.api';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Identity } from '../../../identity/domain/identity.model';
import { TeamUsersAssembler } from '../infrastructure/team-users.assembler';
import { map, switchMap } from 'rxjs';
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
    effect(() => {
      const activeId = this.projectStateService.currentProjectId();
      if (activeId) {
        this.loadIamUsers();
      } else {
        this.teamUsersSignal.set([]);
      }
    });
  }

  loadIamUsers() {
    this.teamApi.getAllIamUsers()
      .pipe(
        switchMap(allUsers =>
          this.teamApi.getCurrentUser().pipe(
            map(currentUser => ({ allUsers, currentUser }))
          )
        )
      )
      .subscribe({
        next: ({ allUsers, currentUser }) => {
          if (!currentUser) {
            this.teamUsersSignal.set(allUsers.map(u => TeamUsersAssembler.toEntityFromIdentity(u)));
            return;
          }
          const currentUserEntity = TeamUsersAssembler.toEntityFromIdentity(currentUser);
          this.currentUserSignal.set(currentUserEntity);

          const filteredAllUsers = allUsers
            .map(u => TeamUsersAssembler.toEntityFromIdentity(u))
            .filter(user => user.email !== currentUserEntity.email);
          this.teamUsersSignal.set(filteredAllUsers);
        },
        error: (err) => console.error('Error loading users:', err)
      });
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
    const updatedUser = { ...user, isActive: !user.isActive };

    this.teamApi.updateUser(updatedUser).subscribe({
      next: (savedUser) => {
        this.teamUsersSignal.update((users) =>
          users.map((u) => (u.id === savedUser.id ? savedUser : u)),
        );
      },
      error: (err) => console.error('Error al actualizar estado:', err),
    });
  }


}
