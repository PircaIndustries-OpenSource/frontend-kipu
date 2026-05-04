import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './verification.component.html',
})
export class VerificationComponent {
  verificationForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.verificationForm = this.fb.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
    });
  }

  onVerify() {
    if (this.verificationForm.valid) {
      const values = this.verificationForm.value;
      const code = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}${values.digit5}${values.digit6}`;
      console.log('Código ingresado:', code);
      this.router.navigate(['/system/inventory']);
    }
  }

  resendCode() {
    console.log('Reenviando código...');
  }
}
