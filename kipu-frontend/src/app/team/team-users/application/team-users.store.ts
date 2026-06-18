import { computed, inject, Injectable, signal } from '@angular/core';
import { TeamUsersEntity } from '../domain/model/team-users.entity';
import { TeamUsersApi } from '../infrastructure/team-users.api';
import { TranslateService } from '@ngx-translate/core';
import { TeamUsersAssembler } from '../infrastructure/team-users.assembler';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamUsersStore {
  teamApi = inject(TeamUsersApi);
  private translate = inject(TranslateService);

  private teamUsersSignal = signal<TeamUsersEntity[]>([]);
  private currentUserSignal = signal<TeamUsersEntity>(new TeamUsersEntity());

  readonly teamUsers = computed(() => this.teamUsersSignal());
  readonly currentUser = computed(() => this.currentUserSignal());

  // Excluimos al current user SOLO para la tabla del HTML
  readonly tableUsers = computed(() => {
    const currentEmail = this.currentUser().email;
    return this.teamUsers().filter((user) => user.email !== currentEmail);
  });

  // Estadísticas basadas en la data global (incluyéndote a ti)
  readonly totalActiveUsers = computed(
    () => this.teamUsers().filter((user) => user.isActive).length,
  );
  readonly totalManagers = computed(
    () =>
      this.teamUsers().filter(
        (user) => user.isActive && (user.role === 'Gestor' || user.role === 'Gestor Operativo'),
      ).length,
  );
  readonly totalLogistics = computed(
    () => this.teamUsers().filter((user) => user.isActive && user.role === 'Logistica').length,
  );
  readonly totalClients = computed(
    () => this.teamUsers().filter((user) => user.isActive && user.role === 'Cliente').length,
  );

  getRoleTranslation(role: string): string {
    const translationMap: Record<string, string> = {
      Administrador: this.translate.instant('team.users.role-dictionary.administrator'),
      Gestor: this.translate.instant('team.users.role-dictionary.manager'),
      'Gestor Operativo': this.translate.instant('team.users.role-dictionary.manager'),
      Logistica: this.translate.instant('team.users.role-dictionary.logistics'),
      Cliente: this.translate.instant('team.users.role-dictionary.client'),
      Ingeniero: this.translate.instant('team.users.role-dictionary.engineer'),
    };
    return translationMap[role] || role;
  }

  loadUsers(searchTerm: string = '') {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) return;

    this.teamApi
      .getAllUsers(projectId, searchTerm)
      .pipe(
        switchMap((allUsers) =>
          this.teamApi.getCurrentUser().pipe(map((currentUser) => ({ allUsers, currentUser }))),
        ),
      )
      .subscribe({
        next: ({ allUsers, currentUser }) => {
          const currentUserEntity = TeamUsersAssembler.toEntityFromIdentity(currentUser);
          this.currentUserSignal.set(currentUserEntity);

          // Verificamos por EMAIL si ya existes en lo que trajo el backend
          const userExists = allUsers.some((user) => user.email === currentUserEntity.email);

          // AUTO-REGISTRO EN LA BASE DE DATOS
          // Si no existes y NO estamos en medio de una búsqueda (searchTerm vacío)
          if (!userExists && (!searchTerm || searchTerm === '')) {
            const payload = {
              fullName: currentUserEntity.fullName,
              email: currentUserEntity.email,
              role: currentUserEntity.role,
              projectId: projectId,
            };

            this.teamApi.createUser(payload).subscribe({
              next: (savedUser) => {
                console.log(
                  '✅ Usuario actual guardado automáticamente en la Base de Datos',
                  savedUser,
                );
                // Insertamos el usuario con el ID real que generó Spring Boot
                this.teamUsersSignal.set([savedUser, ...allUsers]);
              },
              error: (err) => console.error('⚠️ Error al auto-guardar al usuario en la BD:', err),
            });
          } else {
            // Si ya existes, o estamos filtrando, simplemente inyectamos la data normal
            const finalUsers = userExists ? allUsers : [currentUserEntity, ...allUsers];
            this.teamUsersSignal.set(finalUsers);
          }
        },
        error: (err) => console.error('Error loading users:', err),
      });
  }

  inviteUser(userData: any) {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) return;

    const payload = {
      fullName: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      role: userData.role,
      projectId: projectId,
    };

    this.teamApi.createUser(payload).subscribe({
      next: (newUser) => {
        this.teamUsersSignal.update((currentUsers) => [...currentUsers, newUser]);
      },
      error: (err) => console.error('Error al invitar:', err),
    });
  }

  toggleUserStatus(user: TeamUsersEntity) {
    const wantsToActivate = !user.isActive;

    this.teamApi.updateUserStatus(user.id, wantsToActivate).subscribe({
      next: (savedUser) => {
        this.teamUsersSignal.update((users) =>
          users.map((u) => (u.id === savedUser.id ? savedUser : u)),
        );
      },
      error: (err) => console.error('Error al actualizar estado:', err),
    });
  }
}
