import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IdentityService } from '../../../infrastructure/identity.service';
import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, AuthBannerComponent, TranslateModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitting = false;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const emailValue = this.form.get('email')?.value;

    if (!emailValue || typeof emailValue !== 'string') {
      this.form.get('email')?.markAsTouched();
      return;
    }

    this.submitting = true;
    const email = emailValue.trim();

    this.identityService.requestPasswordReset(email).subscribe({
      next: (exists) => {
        this.submitting = false;

        if (exists) {
          this.router.navigate(['/reset-password'], { queryParams: { email } });
          return;
        }

        alert('No se encontró una cuenta con ese correo.');
      },
      error: () => {
        this.submitting = false;
        alert('Error al solicitar el reinicio de contraseña.');
      },
    });
  }
}
