import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierEntity } from '../../../domain/supplier.entity';

@Component({
  selector: 'app-supplier-edit-dialog',
  standalone: true,
  imports: [
    MatDialogModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, TranslatePipe,
  ],
  template: `
    <div [formGroup]="supplierForm" class="p-2 flex flex-col gap-5">
      <h2 mat-dialog-title class="!text-2xl !font-bold text-slate-800">
        {{ 'suppliers.edit.title' | translate }}
      </h2>
      <mat-dialog-content class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full !pt-3">
          <mat-label>{{ 'suppliers.create.ruc-label' | translate }}</mat-label>
          <input matInput formControlName="ruc" maxlength="11">
          @if (supplierForm.get('ruc')?.hasError('required') && supplierForm.get('ruc')?.touched) {
            <mat-error>{{ 'suppliers.create.ruc-required' | translate }}</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.create.social-reason-label' | translate }}</mat-label>
          <input matInput formControlName="socialReason">
          @if (supplierForm.get('socialReason')?.hasError('required') && supplierForm.get('socialReason')?.touched) {
            <mat-error>{{ 'suppliers.create.social-reason-required' | translate }}</mat-error>
          }
        </mat-form-field>
        <div class="flex flex-row gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'suppliers.create.contact-label' | translate }}</mat-label>
            <input matInput formControlName="contact">
            @if (supplierForm.get('contact')?.hasError('required') && supplierForm.get('contact')?.touched) {
              <mat-error>{{ 'suppliers.create.contact-required' | translate }}</mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'suppliers.create.phone-label' | translate }}</mat-label>
            <input matInput formControlName="phone">
            @if (supplierForm.get('phone')?.hasError('required') && supplierForm.get('phone')?.touched) {
              <mat-error>{{ 'suppliers.create.phone-required' | translate }}</mat-error>
            }
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.create.email-label' | translate }}</mat-label>
          <input matInput formControlName="email">
          @if (supplierForm.get('email')?.hasError('required') && supplierForm.get('email')?.touched) {
            <mat-error>{{ 'suppliers.create.email-required' | translate }}</mat-error>
          }
          @if (supplierForm.get('email')?.hasError('email') && supplierForm.get('email')?.touched) {
            <mat-error>{{ 'suppliers.create.email-invalid' | translate }}</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.create.categories-label' | translate }}</mat-label>
          <input matInput formControlName="categories">
          @if (supplierForm.get('categories')?.hasError('required') && supplierForm.get('categories')?.touched) {
            <mat-error>{{ 'suppliers.create.categories-required' | translate }}</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.create.payment-terms-label' | translate }}</mat-label>
          <input matInput formControlName="paymentTerms">
          @if (supplierForm.get('paymentTerms')?.hasError('required') && supplierForm.get('paymentTerms')?.touched) {
            <mat-error>{{ 'suppliers.create.payment-terms-required' | translate }}</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'suppliers.create.status-label' | translate }}</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">{{ 'suppliers.create.status-active' | translate }}</mat-option>
            <mat-option value="inactive">{{ 'suppliers.create.status-inactive' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="!gap-3 !p-6">
        <button mat-button (click)="onCancel()" class="!rounded-md !px-6" type="button">
          {{ 'suppliers.edit.btn-cancel' | translate }}
        </button>
        <button mat-flat-button color="primary"
                class="!bg-blue-600 !rounded-md !px-6 shadow-lg shadow-blue-200"
                (click)="onSave()" type="button">
          {{ 'suppliers.edit.btn-save' | translate }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class SupplierEditDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierEditDialog>);
  data: SupplierEntity = inject(MAT_DIALOG_DATA);

  supplierForm: FormGroup = this.fb.group({
    ruc: [this.data.ruc, [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    socialReason: [this.data.socialReason, Validators.required],
    contact: [this.data.contact, Validators.required],
    phone: [this.data.phone, Validators.required],
    email: [this.data.email, [Validators.required, Validators.email]],
    categories: [this.data.categories, Validators.required],
    paymentTerms: [this.data.paymentTerms, Validators.required],
    status: [this.data.status],
  });

  onSave() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.supplierForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
