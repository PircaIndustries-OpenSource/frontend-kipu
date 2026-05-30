import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { ConcreteEntity } from '../../../../domain/concrete.entity';

@Component({
  selector: 'app-edit-concrete-curing-dialog-component',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    TranslatePipe,
    MatIcon,
  ],
  templateUrl: './edit-concrete-curing-dialog-component.html',
  styleUrl: './edit-concrete-curing-dialog-component.css',
})
export class EditConcreteCuringDialogComponent {
  private dialogRef = inject(MatDialogRef<EditConcreteCuringDialogComponent>);
  protected data: ConcreteEntity = inject(MAT_DIALOG_DATA);

  protected editForm = {
    state: this.data.state,
    limit: this.data.limit,
    unit: this.data.unit,
  };

  onSave() {
    const updated = new ConcreteEntity();
    updated.id = this.data.id;
    updated.sensorId = this.data.sensorId;
    updated.location = this.data.location;
    updated.temperature = this.data.temperature;
    updated.humidity = this.data.humidity;
    updated.projectId = this.data.projectId;
    updated.state = this.editForm.state;
    updated.limit = this.editForm.limit;
    updated.unit = this.editForm.unit;
    this.dialogRef.close(updated);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
