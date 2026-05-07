import { Component, input } from '@angular/core';
import { WasteEntity } from '../../../domain/waste.entity';
import { WasteItem } from '../waste-item/waste-item';

@Component({
  selector: 'app-waste-list',
  imports: [WasteItem],
  templateUrl: './waste-list.html',
  styleUrl: './waste-list.css',
})
export class WasteList {
  wasteList = input.required<WasteEntity[]>();
}
