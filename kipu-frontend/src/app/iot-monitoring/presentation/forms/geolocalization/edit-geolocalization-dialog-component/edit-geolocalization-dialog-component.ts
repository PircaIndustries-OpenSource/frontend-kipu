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
import { GeolocalizationEntity } from '../../../../domain/geolocalization.entity';

@Component({
  selector: 'app-edit-geolocalization-dialog-component',
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
  templateUrl: './edit-geolocalization-dialog-component.html',
  styleUrl: './edit-geolocalization-dialog-component.css',
})
export class EditGeolocalizationDialogComponent {
  private dialogRef = inject(MatDialogRef<EditGeolocalizationDialogComponent>);
  protected data: GeolocalizationEntity = inject(MAT_DIALOG_DATA);

  protected editForm = {
    name: this.data.name,
    latitude: this.data.latitude,
    longitude: this.data.longitude,
    state: this.data.state,
  };

  onSave() {
    const updated = new GeolocalizationEntity();
    updated.id = this.data.id;
    updated.numberId = this.data.numberId;
    updated.projectId = this.data.projectId;
    updated.name = this.editForm.name;
    updated.latitude = Number(this.editForm.latitude);
    updated.longitude = Number(this.editForm.longitude);
    updated.state = this.editForm.state;
    this.dialogRef.close(updated);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
