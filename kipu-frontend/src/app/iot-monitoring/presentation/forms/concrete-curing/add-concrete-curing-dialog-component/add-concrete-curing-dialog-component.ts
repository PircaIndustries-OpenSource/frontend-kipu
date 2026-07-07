import { Component, inject } from '@angular/core';
import { ConcreteEntity } from '../../../../domain/concrete.entity';
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
  selector: 'app-add-concrete-curing-dialog-component',
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
  templateUrl: './add-concrete-curing-dialog-component.html',
  styleUrl: './add-concrete-curing-dialog-component.css',
})
export class AddConcreteCuringDialogComponent {
  private dialogRef = inject(MatDialogRef<AddConcreteCuringDialogComponent>);

  protected sensorForm = {
    sensorId: '',
    location: '',
    unit: '',
    limit: 0,
    lastLecture: 0,
    humidity: 0,
    temperature: 0,
    state: 'OFFLINE',
  };

  onSave() {
    const entity = new ConcreteEntity();
    entity.id = Math.random().toString(36).substring(2, 9);
    entity.projectId = localStorage.getItem('currentProjectId') || '';
    entity.sensorId = this.sensorForm.sensorId;
    entity.location = this.sensorForm.location;
    entity.humidity = this.sensorForm.humidity;
    entity.temperature = this.sensorForm.temperature;
    entity.unit = this.sensorForm.unit;
    entity.limit = this.sensorForm.limit;
    entity.state = this.sensorForm.state;

    this.dialogRef.close(entity);
  }
  onCancel() {
    this.dialogRef.close();
  }
}
