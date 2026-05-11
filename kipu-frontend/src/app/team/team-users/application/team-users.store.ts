import { computed, inject, Injectable, signal } from '@angular/core';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamWorkersEntity } from '../../team-workers/domain/model/team-workers.entity';
import { TeamUsersApi } from '../infrastructure/team-users.api';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Identity } from '../../../identity/domain/identity.model';
import { TeamUsersAssembler } from '../infrastructure/team-users.assembler';
import { map, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TeamUsersStore {
  teamApi = inject(TeamUsersApi);
  private translate = inject(TranslateService);

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


loadUsers() {
  if (this.teamUsersSignal().length === 0) {
    this.teamApi.getAllUsers()
      .pipe(
        switchMap(allUsers =>
          this.teamApi.getCurrentUser().pipe(
            map(currentUser => ({ allUsers, currentUser }))
          )
        )
      )
      .subscribe({
        next: ({ allUsers, currentUser }) => {
          const currentUserEntity = TeamUsersAssembler.toEntityFromIdentity(currentUser);
          this.currentUserSignal.set(currentUserEntity);
          // Verificar si ya existe
          const userExists = allUsers.some(user => user.id === currentUserEntity.id);

          // Agregar solo si no existe
          const finalUsers = userExists ? allUsers : [...allUsers, currentUserEntity];

          this.teamUsersSignal.set(finalUsers);
        },
        error: (err) => console.error('Error loading users:', err)
      });
  }
}

  updateSearchTerm(term: string) {
    this.searchTermSignal.set(term);
  }

  cleanSearch() {
    this.searchTermSignal.set('');
  }

  inviteUser(userData: any) {
    const userToSave = {
      ...userData,
      fullName: `${userData.firstName} ${userData.lastName}`,
      isActive: true,
      id: `us-${Date.now()}`,
    };

    this.teamApi.postUser(userToSave).subscribe({
      next: (newUser) => {
        // Si la API responde OK, actualizamos la lista local para que
        // el nuevo usuario aparezca en la tabla sin recargar la página.
        this.teamUsersSignal.update((currentUsers) => [...currentUsers, newUser]);
      },
      error: (err) => console.error('Error al invitar:', err),
    });
  }

  toggleUserStatus(user: TeamUsersEntity) {
    const updatedUser = { ...user, isActive: !user.isActive };

    // 1. Avisamos al servidor
    this.teamApi.updateUser(updatedUser).subscribe({
      next: (savedUser) => {
        // 2. Actualizamos la Signal de forma inmutable
        this.teamUsersSignal.update((users) =>
          users.map((u) => (u.id === savedUser.id ? savedUser : u)),
        );
      },
      error: (err) => console.error('Error al actualizar estado:', err),
    });
  }


}
