import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MachineryEntity } from '../../../domain/machinery.entity';
import { MachineryItem } from '../machinery-item/machinery-item';

@Component({
  selector: 'app-machinery-list',
  imports: [MachineryItem, TranslatePipe, MatIcon],
  templateUrl: './machinery-list.html',
  styleUrl: './machinery-list.css',
})
export class MachineryList {
  items = input.required<MachineryEntity[]>();
}
