import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { SeismicEntity } from '../../../../domain/seismic.entity';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-seismic-sensor-dialog-component',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDialogTitle,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatInput,
    TranslatePipe,
  ],
  templateUrl: './add-seismic-sensor-dialog-component.html',
  styleUrl: './add-seismic-sensor-dialog-component.css',
})
export class AddSeismicSensorDialogComponent {
  private dialogRef = inject(MatDialogRef<AddSeismicSensorDialogComponent>);

  protected sensorForm = {
    sensorId: '',
    location: '',
    unit: '',
    limit: 0,
    lastLecture: 0,
    state: 'NORMAL',
  };

  onSave() {
    const entity = new SeismicEntity();
    entity.id = Math.random().toString(36).substring(2, 9);
    entity.sensorId = this.sensorForm.sensorId;
    entity.name = this.sensorForm.sensorId;
    entity.location = this.sensorForm.location;
    entity.unit = this.sensorForm.unit;
    entity.limit = this.sensorForm.limit;
    entity.lastLecture = this.sensorForm.lastLecture;

    if (this.sensorForm.limit <= this.sensorForm.lastLecture) entity.state = 'RISK';
    else entity.state = 'NORMAL';

    entity.timeLecture = new Date().toLocaleString();

    this.dialogRef.close(entity);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
