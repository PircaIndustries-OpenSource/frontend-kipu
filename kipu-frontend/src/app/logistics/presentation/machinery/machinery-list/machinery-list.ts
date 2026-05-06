import { Component, input } from '@angular/core';
import { MachineryEntity } from '../../../domain/machinery.entity';
import { MachineryItem } from '../machinery-item/machinery-item';

@Component({
  selector: 'app-machinery-list',
  imports: [MachineryItem],
  templateUrl: './machinery-list.html',
  styleUrl: './machinery-list.css',
})
export class MachineryList {
  items = input.required<MachineryEntity[]>();
}
