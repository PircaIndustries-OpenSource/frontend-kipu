import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RequestViewModel } from '../../../../domain/request.entity';

@Component({
  selector: 'app-request-modify-dialog',
  imports: [
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
  ],
  templateUrl: './request-modify-dialog.html',
  styleUrl: './request-modify-dialog.css',
})
export class RequestModifyDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RequestModifyDialog>);
  private data = inject<RequestViewModel>(MAT_DIALOG_DATA);

  modifyForm: FormGroup = this.fb.group({
    quantity: [this.data.items[0]?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
    priority: [this.data.priority, Validators.required],
    deadline: [this.data.deadline, Validators.required],
    deliveryLocation: [this.data.deliveryLocation, Validators.required],
    purpose: [this.data.purpose, Validators.required],
    additionalNotes: [this.data.additionalNotes],
  });

  onSave() {
    if (this.modifyForm.invalid) {
      this.modifyForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.modifyForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
