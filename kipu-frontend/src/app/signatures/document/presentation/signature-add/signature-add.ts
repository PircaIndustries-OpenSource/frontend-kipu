import { Component, inject, OnInit, HostListener } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';

@Component({
  selector: 'app-signature-add',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    MatIcon,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
  ],
  templateUrl: './signature-add.html',
  styleUrl: './signature-add.css',
})
export class SignatureAddComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<SignatureAddComponent>);
  private teamUsersStore = inject(TeamUsersStore);
  private fb = inject(FormBuilder);

  documentForm: FormGroup = this.fb.group({
    documentType: ['', Validators.required],
    deadline: ['', Validators.required],
    selectedUsers: [[], [Validators.required, Validators.minLength(1)]],
  });

  showUserDropdown = false;
  userSearchTerm = '';

  get allUsers() {
    // Usamos teamUsers (todos) o tableUsers (excluyendo current), usaremos teamUsers para que todos firmen
    return this.teamUsersStore.teamUsers().filter((user) => user.isActive);
  }

  get filteredUsers() {
    const term = this.userSearchTerm.toLowerCase().trim();
    if (!term) return this.allUsers;
    return this.allUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
    );
  }

  ngOnInit() {
    if (this.teamUsersStore.teamUsers().length === 0) {
      this.teamUsersStore.loadUsers();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) this.showUserDropdown = false;
  }

  toggleUserDropdown(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) this.userSearchTerm = '';
  }

  toggleUserSelection(userId: string) {
    const currentValue = this.documentForm.get('selectedUsers')?.value || [];
    if (currentValue.includes(userId)) {
      this.documentForm
        .get('selectedUsers')
        ?.setValue(currentValue.filter((id: string) => id !== userId));
    } else {
      this.documentForm.get('selectedUsers')?.setValue([...currentValue, userId]);
    }
    this.documentForm.get('selectedUsers')?.markAsTouched();
  }

  isUserSelected(userId: string): boolean {
    return (this.documentForm.get('selectedUsers')?.value || []).includes(userId);
  }

  removeUser(userId: string, event: Event) {
    event.stopPropagation();
    this.toggleUserSelection(userId);
  }

  getUserName(userId: string): string {
    const user = this.allUsers.find((u) => u.id === userId);
    return user?.fullName || userId;
  }

  getInitials(fullName: string): string {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getRoleTranslation(role: string): string {
    return this.teamUsersStore.getRoleTranslation(role);
  }

  onConfirm() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const formValue = this.documentForm.value;
    const currentProjectId = localStorage.getItem('currentProjectId');
    const currentUser = this.teamUsersStore.currentUser();

    // 1. Armamos los firmantes (SignerResource)
    let signersPayload = formValue.selectedUsers.map((userId: string) => {
      const user = this.allUsers.find((u) => u.id === userId);
      return { teamUserId: userId, fullName: user?.fullName || 'Usuario' };
    });

    // 2. Nos aseguramos de incluir al CurrentUser si no estaba
    const currentUserAlreadyAdded = signersPayload.some(
      (s: any) => s.teamUserId === currentUser?.id,
    );
    if (!currentUserAlreadyAdded && currentUser?.id) {
      signersPayload.unshift({ teamUserId: currentUser.id, fullName: currentUser.fullName });
    }

    // 3. Formateamos la fecha para LocalDateTime (Ej: 2026-12-31T23:59:59)
    const deadlineDate = new Date(formValue.deadline);
    const formattedDeadline = deadlineDate.toISOString().substring(0, 19);

    // 4. Creamos el payload exacto de tu backend (CreateDocumentResource)
    const payload = {
      type: formValue.documentType,
      deadLine: formattedDeadline,
      projectId: currentProjectId,
      signers: signersPayload,
    };

    this.dialogRef.close({ success: true, payload: payload });
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  get documentTypeControl() {
    return this.documentForm.get('documentType');
  }
  get deadlineControl() {
    return this.documentForm.get('deadline');
  }
  get selectedUsersControl() {
    return this.documentForm.get('selectedUsers');
  }
}
