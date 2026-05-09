import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { InventoryViewModel } from '../../../domain/inventoryMaterial.entity';

@Component({
  selector: 'app-inventory-item',
  imports: [TranslatePipe, MatCardModule, MatIcon, MatRipple],
  templateUrl: './inventory-item.html',
  styleUrl: './inventory-item.css',
})
export class InventoryItem {
  inventoryMaterial = input.required<InventoryViewModel>();
}
