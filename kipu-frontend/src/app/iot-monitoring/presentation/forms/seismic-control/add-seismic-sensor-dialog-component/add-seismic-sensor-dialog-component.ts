import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { SeismicEntity } from '../../../../domain/seismic.entity';

@Component({
  selector: 'app-add-seismic-sensor-dialog-component',
  imports: [
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDialogTitle,
    MatSelect,
    MatOption,
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatInput,
  ],
  templateUrl: './add-seismic-sensor-dialog-component.html',
  styleUrl: './add-seismic-sensor-dialog-component.css',
})
export class AddSeismicSensorDialogComponent {
  protected newSensor: SeismicEntity = new SeismicEntity();
}
