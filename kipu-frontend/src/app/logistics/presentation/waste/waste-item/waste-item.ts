import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { WasteEntity } from '../../../domain/waste.entity';

@Component({
  selector: 'app-waste-item',
  imports: [MatCard, MatCardContent, TranslatePipe],
  templateUrl: './waste-item.html',
  styleUrl: './waste-item.css',
})
export class WasteItem {
  waste = input.required<WasteEntity>();
}
