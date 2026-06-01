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
import { HopperEntity } from '../../../../domain/hopper.entity';

@Component({
  selector: 'app-edit-hopper-watch-dialog-component',
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
  templateUrl: './edit-hopper-watch-dialog-component.html',
  styleUrl: './edit-hopper-watch-dialog-component.css',
})
export class EditHopperWatchDialogComponent {
  private dialogRef = inject(MatDialogRef<EditHopperWatchDialogComponent>);
  protected data: HopperEntity = inject(MAT_DIALOG_DATA);

  protected editForm = {
    sensorId: this.data.sensorId,
    name: this.data.name,
    unit: this.data.unit,
    limit: this.data.limit,
    lastLecture: this.data.lastLecture,
  };

  onSave() {
    const updated = new HopperEntity();
    updated.id = this.data.id;
    updated.projectId = this.data.projectId;
    updated.sensorId = this.editForm.sensorId;
    updated.name = this.editForm.name;
    updated.unit = this.editForm.unit;
    updated.limit = Number(this.editForm.limit);
    updated.lastLecture = Number(this.editForm.lastLecture);

    if (updated.lastLecture < updated.limit) {
      updated.state = 'CRITIC';
    } else {
      updated.state = 'OPTIMUM';
    }

    this.dialogRef.close(updated);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
