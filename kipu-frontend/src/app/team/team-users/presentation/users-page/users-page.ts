import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamUsersStore } from '../../application/team-users.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TeamUsersEntity } from '../../domain/model/team-users.entity';
import { UsersSendInvitation } from '../users-send-invitation/users-send-invitation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-page',
  imports: [
    RouterModule,
    TranslateModule,
    TranslatePipe,
    MatRipple,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconButton,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage implements OnInit, OnDestroy {
  protected teamStore = inject(TeamUsersStore);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();

  currentUser = this.teamStore.currentUser;
  searchControl = new FormControl('');

  ngOnInit() {
    this.teamStore.loadUsers('');

    // Escucha lo que escribes y le pide al backend que busque
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.teamStore.loadUsers(term || '');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: Record<string, string> = {
      Administrador: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm',
      Gestor: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      'Gestor Operativo': 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      Logistica: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm',
      Cliente: 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm',
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm';
  }

  getRoleTranslation(role: string): string {
    return this.teamStore.getRoleTranslation(role);
  }

  getInitials(fullName: string | undefined | null): string {
    if (!fullName || fullName.trim() === '') return '?';
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) return trimmed[0].toUpperCase();
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
