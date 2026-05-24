import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IdentityService } from '../../../infrastructure/identity.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';
import { AuthStore } from '../../../application/auth.store';
import { OAuthService } from '../../../infrastructure/oauth.service';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
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
    AuthBannerComponent,
    TranslateModule,
    GoogleSigninButtonModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authStore = inject(AuthStore);
  loginForm: FormGroup;
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private router = inject(Router);
  private oauthService = inject(OAuthService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'es';
  }

  constructor() {
    this.translate.onLangChange.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.identityService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            this.authStore.login(user);
            this.router.navigate(['/verification']);
          } else {
            alert('Credenciales incorrectas');
          }
        },
      });
    }
  }

  onGoogleLogin() {
    this.oauthService.loginWithGoogle();
  }

  onMicrosoftLogin() {
    this.oauthService.loginWithMicrosoft();
  }
}
