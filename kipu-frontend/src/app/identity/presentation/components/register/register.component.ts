import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IdentityService } from '../../../infrastructure/identity.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { RegisterSuccessDialogComponent } from './register-success.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  private dialog = inject(MatDialog);
  private router = inject(Router);

  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.emailDuplicationValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  emailDuplicationValidator() {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => this.identityService.checkEmailExists(control.value)),
        map((exist) => (exist ? { emailDuplicated: true } : null)),
        catchError(() => of(null)),
      );
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const newIdentity = this.registerForm.value;

      this.identityService.registerData(newIdentity).subscribe({
        next: () => {
          const dialogRef = this.dialog.open(RegisterSuccessDialogComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => console.error('Error en el registro', error),
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
