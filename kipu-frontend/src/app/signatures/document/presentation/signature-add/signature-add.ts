import { Component, HostListener, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MatDialogModule
} from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { DocumentEntity, UserDocument } from '../../domain/model/document.entity';

@Component({
  selector: 'app-signature-add',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    NgClass,
    MatCheckboxModule,
  ],
  templateUrl: './signature-add.html',
})
export class SignatureAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SignatureAddComponent>);
  protected teamUsersStore = inject(TeamUsersStore);

  documentForm: FormGroup = this.fb.group({
    documentType: ['', Validators.required],
    deadline: ['', Validators.required],
    selectedUsers: [[]],
    attachedFile: [''],
  });

  showUserDropdown = false;
  userSearchTerm = '';

  get allUsers() {
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

  get documentTypeControl() {
    return this.documentForm.get('documentType');
  }

  get deadlineControl() {
    return this.documentForm.get('deadline');
  }

  get selectedUsersControl() {
    return this.documentForm.get('selectedUsers');
  }

  get attachedFileControl() {
    return this.documentForm.get('attachedFile');
  }

  ngOnInit() {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) {
      this.showUserDropdown = false;
    }
  }

  toggleUserDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
  }

  isUserSelected(userId: string): boolean {
    const selected = this.documentForm.get('selectedUsers')?.value || [];
    return selected.includes(userId);
  }

  toggleUserSelection(userId: string) {
    const selected = this.documentForm.get('selectedUsers')?.value || [];
    const index = selected.indexOf(userId);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(userId);
    }
    this.documentForm.get('selectedUsers')?.setValue([...selected]);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentForm.patchValue({ attachedFile: input.files[0] });
    }
  }

  removeUser(userId: string, event?: Event) {
    if (event) event.stopPropagation();
    const selected = this.documentForm.get('selectedUsers')?.value || [];
    const index = selected.indexOf(userId);
    if (index > -1) {
      selected.splice(index, 1);
      this.documentForm.get('selectedUsers')?.setValue(selected);
    }
  }

  getInitials(fullName: string): string {
    if (!fullName || fullName.trim() === '') return '?';
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) return trimmed[0].toUpperCase();
    return (trimmed[0] + trimmed[spaceIndex + 1]).toUpperCase();
  }

  getRoleTranslation(role: string): string {
    const roleMap: Record<string, string> = {
      Administrador: 'Administrador',
      'Gestor Operativo': 'Gestor Operativo',
      Logística: 'Logística',
    };
    return roleMap[role] || role;
  }

  selectUser(user: any) {
    const selected = this.documentForm.get('selectedUsers')?.value || [];
    if (!selected.includes(user.id)) {
      selected.push(user.id);
      this.documentForm.get('selectedUsers')?.setValue(selected);
    }
    this.showUserDropdown = false;
    this.userSearchTerm = '';
  }

  getUserName(userId: string): string {
    const user = this.teamUsersStore.teamUsers().find((u) => u.id === userId);
    return user?.fullName || 'Usuario';
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: Record<string, string> = {
      Administrador: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm',
      'Gestor Operativo': 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
      Logística: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm',
    };
    return roleMap[role] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm';
  }

  onConfirm() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const formValue = this.documentForm.value;
    const currentUser = this.teamUsersStore.currentUser();
    const currentUserId = currentUser?.id || '';
    const currentUserName = currentUser?.fullName || 'Usuario actual';
    const projectId = localStorage.getItem('currentProjectId') || '';

    const assignedUsers: UserDocument[] = formValue.selectedUsers.map((userId: string) => {
      const user = this.teamUsersStore.teamUsers().find((u) => u.id === userId);
      return { id: userId, fullName: user?.fullName || 'Usuario', signedAt: undefined };
    });

    assignedUsers.push({ id: currentUserId, fullName: currentUserName, signedAt: undefined });

    const documentEntity = new DocumentEntity();
    documentEntity.type = formValue.documentType;
    documentEntity.deadLine = new Date(formValue.deadline);
    documentEntity.projectId = projectId;
    documentEntity.assignedTo = assignedUsers;

    this.dialogRef.close({ success: true, document: documentEntity });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
