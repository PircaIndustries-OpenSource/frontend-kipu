import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  ],
  templateUrl: './users-send-invitation.html',
  styleUrl: './users-send-invitation.css',
})
export class UsersSendInvitation {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsersSendInvitation>);

  // Definimos el formulario
  inviteForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: ['', Validators.required],
  });

  onConfirm() {
    if (this.inviteForm.valid) {
      this.dialogRef.close(this.inviteForm.value);
    }
  }
}
