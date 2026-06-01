import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { WasteView } from '../../../application/logistics.store';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-waste-item',
  imports: [MatCard, MatCardContent, TranslatePipe, MatIconModule],
  templateUrl: './waste-item.html',
  styleUrl: './waste-item.css',
})
export class WasteItem {
  waste = input.required<WasteView>();
}
