import { Component, computed, inject, OnInit } from '@angular/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { InventoryList } from '../inventory-list/inventory-list';
import { TranslatePipe } from '@ngx-translate/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { AutocompleteFilterList } from '../../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';
@Component({
  selector: 'app-inventory-page',
  imports: [TranslatePipe, InventoryList, SummaryCard, AutocompleteFilterList],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css',
})
export class InventoryPage implements OnInit {
  protected logisticsStore = inject(LogisticsStore);
  protected readonly inventoryMaterials = this.logisticsStore.filteredInventoryMaterials;
  materialsCount = this.logisticsStore.totalInventoryMaterials;
  criticalMaterialsCount = this.logisticsStore.criticalMaterialsCount;
  categoryNames = this.logisticsStore.categoryNames;
  ngOnInit() {
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadInventoryMaterials();
    this.logisticsStore.loadCategories();
  }
  onCategorySelect(category: string) {
    this.logisticsStore.filterByCategory(category);
  }
}
