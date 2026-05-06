import { Component, input } from '@angular/core';
import { MachineryEntity } from '../../../domain/machinery.entity';
import { MatCardModule } from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-machinery-item',
  imports: [MatCardModule, TranslatePipe],
  templateUrl: './machinery-item.html',
  styleUrl: './machinery-item.css',
})
export class MachineryItem {
  item = input.required<MachineryEntity>();
}
