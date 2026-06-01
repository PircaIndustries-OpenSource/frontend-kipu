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
import { SeismicEntity } from '../../../../domain/seismic.entity';

@Component({
  selector: 'app-edit-seismic-sensor-dialog-component',
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
  templateUrl: './edit-seismic-sensor-dialog-component.html',
  styleUrl: './edit-seismic-sensor-dialog-component.css',
})
export class EditSeismicSensorDialogComponent {
  private dialogRef = inject(MatDialogRef<EditSeismicSensorDialogComponent>);
  protected data: SeismicEntity = inject(MAT_DIALOG_DATA);

  protected editForm = {
    sensorId: this.data.sensorId,
    location: this.data.location,
    unit: this.data.unit,
    limit: this.data.limit,
    lastLecture: this.data.lastLecture,
    state: this.data.state,
  };

  onSave() {
    const updated = new SeismicEntity();
    updated.id = this.data.id;
    updated.projectId = this.data.projectId;
    updated.sensorId = this.editForm.sensorId;
    updated.name = this.editForm.sensorId;
    updated.location = this.editForm.location;
    updated.unit = this.editForm.unit;
    updated.limit = Number(this.editForm.limit);
    updated.lastLecture = Number(this.editForm.lastLecture);
    updated.timeLecture = new Date().toLocaleString();

    if (updated.limit <= updated.lastLecture) {
      updated.state = 'RISK';
    } else {
      updated.state = 'NORMAL';
    }

    this.dialogRef.close(updated);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
