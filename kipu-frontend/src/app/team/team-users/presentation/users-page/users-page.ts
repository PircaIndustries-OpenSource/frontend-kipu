import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamUsersStore } from '../../application/team-users.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TeamUsersEntity } from '../../domain/model/team-users.entity';
import { UsersSendInvitation } from '../users-send-invitation/users-send-invitation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

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
    MatMenuModule,
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
      'Gestor Operativo': 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      Logística: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm',
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm';
  }

  getRoleTranslation(role: string): string {
    const translationMap: Record<string, string> = {
      Administrador: this.translate.instant('team.users.role-dictionary.administrator'),
      'Gestor Operativo': this.translate.instant('team.users.role-dictionary.manager'),
      Logística: this.translate.instant('team.users.role-dictionary.logistics'),
    };
    return translationMap[role] || role;
  }

  toggleUserStatus(user: TeamUsersEntity) {
    this.teamStore.toggleUserStatus(user);
  }

  getInitials(fullName: string | undefined | null): string {
    if (!fullName || fullName.trim() === '') {
      return '?';
    }
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) {
      return trimmed[0].toUpperCase();
    }
    return (trimmed[0] + trimmed[spaceIndex + 1]).toUpperCase();
  }

  openInviteDialog() {
    const dialogRef = this.dialog.open(UsersSendInvitation, { width: '550px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamStore.inviteUser(result);
      }
    });
  }
}
