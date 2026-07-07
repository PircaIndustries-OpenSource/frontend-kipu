import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { InventoryView, LogisticsStore } from '../../../application/logistics.store';

@Component({
  selector: 'app-inventory-item',
  imports: [TranslatePipe, MatCardModule, MatIcon, FormsModule],
  templateUrl: './inventory-item.html',
  styleUrl: './inventory-item.css',
})
export class InventoryItem {
  inventoryMaterial = input.required<InventoryView>();
  private store = inject(LogisticsStore);

  editingMinStock = signal(false);
  editValue = signal(0);

  startEdit() {
    this.editValue.set(this.inventoryMaterial().miniumStock);
    this.editingMinStock.set(true);
  }

  saveMinStock() {
    this.editingMinStock.set(false);
    const newVal = this.editValue();
    if (newVal >= 0 && newVal !== this.inventoryMaterial().miniumStock) {
      this.store.updateInventoryMinimumStock(this.inventoryMaterial().id, newVal);
    }
  }

  cancelEdit() {
    this.editingMinStock.set(false);
  }
}
