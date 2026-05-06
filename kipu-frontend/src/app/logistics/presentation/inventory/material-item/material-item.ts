import { Component, input } from '@angular/core';
import { MaterialEntity } from '../../../domain/material.entity';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-material-item',
  imports: [TranslatePipe, MatCardModule, MatIcon, MatRipple],
  templateUrl: './material-item.html',
  styleUrl: './material-item.css',
})
export class MaterialItem {
  material = input.required<MaterialEntity>();
}
