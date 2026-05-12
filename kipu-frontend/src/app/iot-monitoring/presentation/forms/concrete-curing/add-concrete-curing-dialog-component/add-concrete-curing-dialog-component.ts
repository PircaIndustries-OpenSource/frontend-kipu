import { Component } from '@angular/core';
import { ConcreteEntity } from '../../../../domain/concrete.entity';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add-concrete-curing-dialog-component',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
  ],
  templateUrl: './add-concrete-curing-dialog-component.html',
  styleUrl: './add-concrete-curing-dialog-component.css',
})
export class AddConcreteCuringDialogComponent {
  protected newSensor: ConcreteEntity = new ConcreteEntity();
}
