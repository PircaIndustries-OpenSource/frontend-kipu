import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IdentityService } from '../../../infrastructure/identity.service';
import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';
import { MatDividerModule } from '@angular/material/divider';
import { ResetSuccessDialogComponent } from './reset-password-success.component';


function passwordMatch(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink, MatDividerModule, AuthBannerComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private identityService = inject(IdentityService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatch },
  );

  submitting = false;

  constructor() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.form.patchValue({ email });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const emailValue = this.form.get('email')?.value;
    const passwordValue = this.form.get('password')?.value;

    if (!emailValue || typeof emailValue !== 'string') {
      this.form.get('email')?.markAsTouched();
      return;
    }

    if (!passwordValue || typeof passwordValue !== 'string') {
      this.form.get('password')?.markAsTouched();
      return;
    }

    this.submitting = true;
    const email = emailValue.trim();

    this.identityService.resetPassword(email, passwordValue).subscribe({
      next: (ok) => {
        this.submitting = false;

        if (!ok) {
          alert('No se pudo cambiar la contraseña.');
          return;
        }

        const dialogRef = this.dialog.open(ResetSuccessDialogComponent, {
          width: '600px',
          panelClass: 'custom-dialog-container',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/login']);
        });
      },
      error: () => {
        this.submitting = false;
        alert('Error al cambiar la contraseña.');
      },
    });
  }
}
