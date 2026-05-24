import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
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
import { MatSelectModule } from '@angular/material/select';

import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';
import { Identity } from '../../../domain/identity.model';
import { OAuthUser } from '../../../domain/oauth-user.model';
import { IdentityService } from '../../../infrastructure/identity.service';
import { OAuthService } from '../../../infrastructure/oauth.service';
import { RegisterSuccessDialogComponent } from './register-success.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { TranslateService } from '@ngx-translate/core';

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
    MatSelectModule,
    AuthBannerComponent,
    TranslateModule,
    TitleCasePipe,
    GoogleSigninButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isOAuthRegister = false;
  oauthUserMetadata?: OAuthUser;

  private identityService = inject(IdentityService);
  private oauthService = inject(OAuthService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'es';
  }

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.emailDuplicationValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // 1. Capture Router Navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { oauthUser: OAuthUser };
    
    // Also fallback check from history state in case of page reload behavior
    const oauthUser = state?.oauthUser || history.state?.oauthUser;

    if (oauthUser) {
      this.oauthUserMetadata = oauthUser;
      this.isOAuthRegister = true;
      this.initializeOAuthForm(oauthUser);
    }

    this.oauthService.newOAuthUser$.subscribe((user) => {
      this.oauthUserMetadata = user;
      this.isOAuthRegister = true;
      this.initializeOAuthForm(user);
      this.cdr.detectChanges();
    });
  }

  private initializeOAuthForm(user: OAuthUser): void {
    let name = user.name || '';
    if (!name && user.givenName) {
      name = `${user.givenName} ${user.familyName || ''}`.trim();
    }

    this.registerForm = this.fb.group({
      name: [name, [Validators.required]],
      email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
      password: [`OAuth-${user.provider}-${Math.random().toString(36).slice(-8)}`, []],
      role: ['', [Validators.required]],
    });
  }

  onGoogleLogin(): void {
    this.oauthService.loginWithGoogle();
  }

  onMicrosoftLogin(): void {
    this.oauthService.loginWithMicrosoft();
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
      const formValues = this.registerForm.getRawValue();
      const newIdentity: Identity = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role
      };

      this.identityService.registerData(newIdentity).subscribe({
        next: (response) => {
          console.log('Cuenta creada exitosamente:', response);
          const dialogRef = this.dialog.open(RegisterSuccessDialogComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/login']);
          });
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