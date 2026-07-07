import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { WasteItem } from '../waste-item/waste-item';
import { WasteView } from '../../../application/logistics.store';

@Component({
  selector: 'app-waste-list',
  imports: [WasteItem, TranslatePipe, MatIcon],
  templateUrl: './waste-list.html',
  styleUrl: './waste-list.css',
})
export class WasteList {
  wasteList = input.required<WasteView[]>();
}
