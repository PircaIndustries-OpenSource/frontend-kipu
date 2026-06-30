import { Component, input } from '@angular/core';
import { InventoryItem } from '../inventory-item/inventory-item';
import { InventoryView } from '../../../application/logistics.store';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-inventory-list',
  imports: [InventoryItem, MatIconModule],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.css',
})
export class InventoryList {
  inventoryMaterials = input.required<InventoryView[]>();
}
