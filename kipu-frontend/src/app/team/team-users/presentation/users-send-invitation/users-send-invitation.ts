import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamUsersApi } from '../../infrastructure/team-users.api';
import { Identity } from '../../../../identity/domain/identity.model';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../../identity/application/auth.store';

@Component({
  selector: 'app-users-send-invitation',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './users-send-invitation.html',
  styleUrl: './users-send-invitation.css',
})
export class UsersSendInvitation implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsersSendInvitation>);
  private teamApi = inject(TeamUsersApi);
  private authStore = inject(AuthStore);

  iamUsers: Identity[] = [];
  roles = ['Administrador', 'Logística', 'Gestor Operativo'];

  inviteForm: FormGroup = this.fb.group({
    selectedUser: [null, Validators.required],
    role: ['', Validators.required],
  });

  ngOnInit() {
    const currentEmail = this.authStore.currentUser()?.email || '';
    this.teamApi.getAllIamUsers().subscribe({
      next: (users) => {
        this.iamUsers = users.filter((u) => u.email !== currentEmail);
      },
      error: (err) => console.error('Error loading IAM users', err),
    });
  }

  onConfirm() {
    if (this.inviteForm.valid) {
      const selectedUser: Identity = this.inviteForm.value.selectedUser;
      this.dialogRef.close({
        userId: Number(selectedUser.id),
        fullName: selectedUser.name || selectedUser.email,
        email: selectedUser.email,
        role: this.inviteForm.value.role,
      });
    }
  }
}
