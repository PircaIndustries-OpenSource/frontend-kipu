import { Component, computed, inject, OnInit } from '@angular/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { MaterialList } from '../material-list/material-list';
import { TranslatePipe } from '@ngx-translate/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { AutocompleteFilterList } from '../../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';
@Component({
  selector: 'app-inventory-page',
  imports: [TranslatePipe, MaterialList, SummaryCard, AutocompleteFilterList],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css',
})
export class InventoryPage implements OnInit {
  protected logisticsStore = inject(LogisticsStore);
  protected readonly materials = this.logisticsStore.filteredMaterials;
  materialsCount = this.logisticsStore.totalMaterials;
  criticalMaterialsCount = this.logisticsStore.criticalMaterialsCount;
  categories = this.logisticsStore.uniqueCategories;
  ngOnInit() {
    this.logisticsStore.loadMaterials();
  }
  onCategorySelect(category: string) {
    this.logisticsStore.filterByCategory(category);
  }
}
