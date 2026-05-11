import { Component, input } from '@angular/core';
import { InventoryItem } from '../inventory-item/inventory-item';
import { InventoryView } from '../../../application/logistics.store';
@Component({
  selector: 'app-inventory-list',
  imports: [InventoryItem],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.css',
})
export class InventoryList {
  inventoryMaterials = input.required<InventoryView[]>();
}
