import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { IdentityService } from '../../../core/services/identity.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
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

  private identityService = new IdentityService();

  constructor(private fb: FormBuilder) {
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
        next: (response) => {
          // Escenario 1: El sistema emite la confirmación de cuenta creada
          console.log('Cuenta creada exitosamente:', response);
          alert('Identidad habilitada en el sistema correctamente.');

          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Fallo en la comunicación con el servidor:', error);
          alert('Error crítico al intentar registrar la cuenta.');
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
