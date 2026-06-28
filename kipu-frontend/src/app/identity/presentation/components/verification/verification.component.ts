import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AuthBannerComponent } from '../../../../shared/presentation/components/auth-banner/auth-banner.component';
import { ResendDialogComponent } from './verification-resend.component';
import { IdentityService } from '../../../infrastructure/identity.service';
import { AuthStore } from '../../../application/auth.store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, AuthBannerComponent, TranslateModule, ReactiveFormsModule],
  templateUrl: './verification.component.html',
})
export class VerificationComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private authStore = inject(AuthStore);

  email = '';
  context = '';
  userState: any = null;
  rememberMe = false;
  otpForm: FormGroup;
  isSubmitting = false;

  isResendDisabled = signal<boolean>(false);
  countdown = signal<number>(15);

  private timerInterval: any;

  constructor() {
    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.context = params['context'];
      
      if (!this.email) {
        this.router.navigate(['/login']);
      }
    });

    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      if (nav.extras.state['user']) this.userState = nav.extras.state['user'];
      if (nav.extras.state['rememberMe']) this.rememberMe = nav.extras.state['rememberMe'];
    } else if (history.state) {
      if (history.state['user']) this.userState = history.state['user'];
      if (history.state['rememberMe']) this.rememberMe = history.state['rememberMe'];
    }
  }

  onVerify() {
    if (this.otpForm.valid) {
      this.isSubmitting = true;
      const code = this.otpForm.value.code;
      
      this.identityService.validateOtp(this.email, code).subscribe({
        next: (isValid) => {
          this.isSubmitting = false;
          if (isValid) {
            if (this.context === 'login' && this.userState) {
              if (this.rememberMe) {
                localStorage.setItem('trusted_device_' + this.email, JSON.stringify({
                  timestamp: new Date().getTime()
                }));
              }
              this.authStore.login(this.userState);
              this.router.navigate(['/projects']);
            } else if (this.context === 'reset') {
              this.router.navigate(['/reset-password'], { queryParams: { email: this.email, code: code } });
            } else {
              this.router.navigate(['/login']);
            }
          } else {
            alert('Código incorrecto. Inténtalo de nuevo.');
          }
        },
        error: () => {
          this.isSubmitting = false;
          alert('Error al validar el código.');
        }
      });
    }
  }

  onResendCode(event: Event) {
    event.preventDefault();

    if (this.isResendDisabled()) return;

    this.isResendDisabled.set(true);

    this.dialog.open(ResendDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    this.identityService.generateOtp(this.email).subscribe({
      next: () => {
        this.countdown.set(15);

        this.timerInterval = setInterval(() => {
          this.countdown.update((c) => c - 1);

          if (this.countdown() <= 0) {
            clearInterval(this.timerInterval);
            this.isResendDisabled.set(false);
          }
        }, 1000);
      },
      error: () => {
        this.isResendDisabled.set(false);
        alert('Error al reenviar el correo.');
      }
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
