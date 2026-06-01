import { Component, inject } from '@angular/core';
import { GeolocalizationEntity } from '../../../../domain/geolocalization.entity';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
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

@Component({
  selector: 'app-add-geolocalization-dialog-component',
  standalone: true,
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
  templateUrl: './add-geolocalization-dialog-component.html',
  styleUrl: './add-geolocalization-dialog-component.css',
})
export class AddGeolocalizationDialogComponent {
  private dialogRef = inject(MatDialogRef<AddGeolocalizationDialogComponent>);

  protected sensorForm = {
    name: '',
    latitude: 0,
    longitude: 0,
    state: 'OPERATIVE',
  };

  onSave() {
    const entity = new GeolocalizationEntity();
    entity.id = Math.random().toString(36).substring(2, 9);
    entity.numberId = Math.floor(Math.random() * 1000) + 100;
    entity.name = this.sensorForm.name;
    entity.projectId = 'proj-01';
    entity.latitude = Number(this.sensorForm.latitude);
    entity.longitude = Number(this.sensorForm.longitude);
    entity.state = this.sensorForm.state;

    this.dialogRef.close(entity);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
