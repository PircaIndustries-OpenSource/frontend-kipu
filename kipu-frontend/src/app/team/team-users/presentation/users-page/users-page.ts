import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamUsersStore } from '../../application/team-users.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TeamUsersEntity } from '../../domain/model/team-users.entity';
import { UsersSendInvitation } from '../users-send-invitation/users-send-invitation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-users-page',
  imports: [
    RouterModule,
    TranslateModule,
    TranslatePipe,
    MatRipple,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
    MatDialogModule,
    MatInput,
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage implements OnInit {
  protected teamStore = inject(TeamUsersStore);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  currentUser = this.teamStore.currentUser;
  searchControl = new FormControl('');
  ngOnInit() {
    this.teamStore.loadIamUsers();

    this.searchControl.valueChanges.subscribe((value) => {
      this.teamStore.updateSearchTerm(value || '');
    });
  }
  onSearchChange(term: string) {
    this.teamStore.updateSearchTerm(term);
  }
  clearSearch() {
    this.searchControl.setValue('');
    this.teamStore.cleanSearch();
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: Record<string, string> = {
      Administrador: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm',
      ROLE_ADMIN: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm',
      Gestor: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      "Gestor Operativo": 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      ROLE_USER: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      Logistica: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm',
      ROLE_LOGISTICS: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm',
      Cliente: 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm',
      ROLE_CLIENT: 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm',
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm';
  }

  getRoleTranslation(role: string): string {
    const translationMap: Record<string, string> = {
      Administrador: this.translate.instant('team.users.role-dictionary.administrator'),
      ROLE_ADMIN: this.translate.instant('team.users.role-dictionary.administrator'),
      Gestor: this.translate.instant('team.users.role-dictionary.manager'),
      "Gestor Operativo": this.translate.instant('team.users.role-dictionary.manager'),
      ROLE_USER: this.translate.instant('team.users.role-dictionary.manager'),
      Logistica: this.translate.instant('team.users.role-dictionary.logistics'),
      ROLE_LOGISTICS: this.translate.instant('team.users.role-dictionary.logistics'),
      Cliente: this.translate.instant('team.users.role-dictionary.client'),
      ROLE_CLIENT: this.translate.instant('team.users.role-dictionary.client'),
      Ingeniero: this.translate.instant('team.users.role-dictionary.engineer'),
    };
    return translationMap[role] || role;
  }

  disableUser(user: TeamUsersEntity) {
    console.log('Deshabilitar usuario:', user);
    user.isActive = !user.isActive;
  }
  getInitials(fullName: string | undefined | null): string {
    if (!fullName || fullName.trim() === '') {
      return '?'; // O '??', 'NA', etc.
    }

    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(' ');

    if (spaceIndex === -1) {
      // Solo un nombre
      return trimmed[0].toUpperCase();
    }

    // Primer letra del primer nombre + primer letra del apellido
    return (trimmed[0] + trimmed[spaceIndex + 1]).toUpperCase();
  }

  isCurrentUser(user: TeamUsersEntity) {
    return user.role == 'Administrador';
  }

  openInviteDialog() {
    const dialogRef = this.dialog.open(UsersSendInvitation, { width: '550px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 'result' contiene el objeto con: email, firstName, lastName, role
        console.log('Datos recibidos del modal:', result);
        this.teamStore.inviteUser(result);
        // Aquí podrías llamar a tu servicio para guardarlo:
        // this.teamApi.inviteUser(result).subscribe(...);
      }
    });
  }
}
