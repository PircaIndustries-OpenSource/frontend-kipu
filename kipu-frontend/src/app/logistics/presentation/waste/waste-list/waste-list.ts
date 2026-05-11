import { Component, input } from '@angular/core';
import { WasteItem } from '../waste-item/waste-item';
import { WasteView } from '../../../application/logistics.store';

@Component({
  selector: 'app-waste-list',
  imports: [WasteItem],
  templateUrl: './waste-list.html',
  styleUrl: './waste-list.css',
})
export class WasteList {
  wasteList = input.required<WasteView[]>();
}
