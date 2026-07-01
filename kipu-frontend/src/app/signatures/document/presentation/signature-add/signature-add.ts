import { Component, inject, OnInit, HostListener } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DocumentsStore } from '../../application/document.store';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';
import { DocumentEntity, UserDocument } from '../../domain/model/document.entity';

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
  private documentsStore = inject(DocumentsStore);
  private teamUsersStore = inject(TeamUsersStore);
  private fb = inject(FormBuilder);

  documentForm: FormGroup = this.fb.group({
    documentType: ['', Validators.required],
    deadline: ['', Validators.required],
    selectedUsers: [[], [Validators.required, Validators.minLength(1)]],
    attachedFile: ['', Validators.required],
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

  ngOnInit() {
    if (this.teamUsersStore.teamUsers().length === 0) {
      this.teamUsersStore.loadIamUsers();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) {
      this.showUserDropdown = false;
    }
  }

  toggleUserDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.userSearchTerm = '';
    }
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
    const roleMap: Record<string, string> = {
      Administrador: 'Administrador',
      Gestor: 'Gestor',
      'Gestor Operativo': 'Gestor',
      Logistica: 'Logística',
      Cliente: 'Cliente',
      Ingeniero: 'Ingeniero',
    };
    return roleMap[role] || role;
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

    const assignedUsers: UserDocument[] = formValue.selectedUsers.map((userId: string) => {
      const user = this.teamUsersStore.teamUsers().find((u) => u.id === userId);
      return {
        id: userId,
        fullName: user?.fullName || 'Usuario',
        signedAt: undefined,
      };
    });

    const currentUserAlreadyAdded = assignedUsers.some((u) => u.id === currentUserId);

    if (!currentUserAlreadyAdded && currentUserId) {
      assignedUsers.unshift({
        id: currentUserId,
        fullName: currentUserName,
        signedAt: undefined,
      });
    }

    const newDocument = new DocumentEntity();
    newDocument.id = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    newDocument.type = formValue.documentType;
    newDocument.deadLine = new Date(formValue.deadline);
    newDocument.isSigned = false;
    newDocument.digitalSignatureToken = null;
    newDocument.assignedTo = assignedUsers;

    console.log(' Documento creado:', newDocument);
    console.log(' Fecha límite:', newDocument.deadLine);

    this.dialogRef.close({
      success: true,
      document: newDocument,
    });
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

  get attachedFileControl() {
    return this.documentForm.get('attachedFile');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.documentForm.get('attachedFile')?.setValue(file.name);
    } else {
      this.documentForm.get('attachedFile')?.setValue('');
    }
    this.documentForm.get('attachedFile')?.markAsTouched();
  }
}
