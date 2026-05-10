import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';

@Component({
  selector: 'app-waste-report-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    TranslatePipe,
  ],
  templateUrl: './waste-report-form.html',
})
export class WasteReportForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<WasteReportForm>);
  logisticsStore = inject(LogisticsStore);

  materials = this.logisticsStore.filteredMaterials;

  ngOnInit() {
    this.logisticsStore.loadMaterials();
  }

  wasteForm: FormGroup = this.fb.group({
    materialId: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0.01)]],
    unit: ['', Validators.required],
    classificationType: ['', Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    description: ['', Validators.required],
    reportedBy: ['', Validators.required],
  });

  onSave() {
    if (this.wasteForm.invalid) {
      this.wasteForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.wasteForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
