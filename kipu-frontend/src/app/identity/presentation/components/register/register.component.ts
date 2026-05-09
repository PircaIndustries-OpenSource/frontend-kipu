import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';
import { Identity } from '../../../domain/identity.model';
import { IdentityService } from '../../../infrastructure/identity.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    AuthBannerComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  private identityService = inject(IdentityService);
  private fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], [this.emailDuplicationValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
      const newIdentity: Identity = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        name: 'Usuario Nuevo',
        role: 'Gestor Operativo'
      };

      this.identityService.registerData(newIdentity).subscribe({
        next: (response) => {
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