import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { HopperEntity } from '../../../../domain/hopper.entity';

@Component({
  selector: 'app-add-hopper-watch-dialog-component',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './add-hopper-watch-dialog-component.html',
  styleUrl: './add-hopper-watch-dialog-component.css',
})
export class AddHopperWatchDialogComponent {
  private dialogRef = inject(MatDialogRef<AddHopperWatchDialogComponent>);

  protected sensorForm = {
    sensorId: '',
    name: '',
    unit: '',
    limit: 0,
    lastLecture: 0,
    state: 'NORMAL',
  };

  onSave() {
    const entity = new HopperEntity();
    entity.id = Math.random().toString(36).substring(2, 9);
    entity.sensorId = this.sensorForm.sensorId;
    entity.name = this.sensorForm.name;
    entity.unit = this.sensorForm.unit;
    entity.limit = this.sensorForm.limit;
    entity.lastLecture = this.sensorForm.lastLecture;

    if (this.sensorForm.limit > this.sensorForm.lastLecture) entity.state = 'CRITIC';
    else if (
      this.sensorForm.lastLecture >= this.sensorForm.limit &&
      this.sensorForm.lastLecture <= this.sensorForm.limit - 2
    )
      entity.state = 'CRITIC';
    else entity.state = 'OPTIMUM';

    this.dialogRef.close(entity);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
