import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutocompleteFilterList } from '../../../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LogisticsStore } from '../../../../application/logistics.store';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DecimalPipe } from '@angular/common';
import { BudgetStore } from '../../../../../budget/application/budget-store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-create',
  imports: [
    TranslatePipe,
    MatFormFieldModule,
    AutocompleteFilterList,
    MatInputModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatSelect,
    MatOption,
    MatIcon,
    MatRippleModule,
    DecimalPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './request-create.html',
  styleUrl: './request-create.css',
})
export class RequestCreate {
  materialResetCounter = signal(0);
  quantityControl = new FormControl(1);
  getQuantityInput() {
    return this.quantityControl.value;
  }
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);

  categories = this.logisticsStore.categories;
  materials = this.logisticsStore.filteredMaterials;
  nameCategories = computed<string[]>(() =>
    this.categories().map((category) => category.name),
  );
  nameMaterials = computed<string[]>(() =>
    this.materials().map((material) => material.name),
  );
  nameBudgetLines = this.budgetStore
    .budgetItems()
    .map((b) => `${b.code} - ${b.name}`);

  /*
  budgetedAmount = computed<number>(() => {
    return this.getQuantityInput()  * this.materialSelected.price;
  });

  budgetProgress = computed(() => {
    const total = this.budgetedAmount();
    if (total === 0) return 0;
    return Math.round((this.executedAmount() / total) * 100);
  });
  * */

  executedAmount = this.budgetStore.totalExecuted;
  availableAmount = this.budgetStore.totalAvailable;

  onCategoryMaterialSelect(category: string) {
    this.logisticsStore.filterByCategory(category);
    this.materialResetCounter.update((v) => v + 1);
  }
  onMaterialSelect(materialName: string) {
    this.logisticsStore.setSelectedMaterial(materialName);
  }
  selectedUnit = computed(() => this.materialSelected()?.measureUnit);
  nameSuppliers = this.logisticsStore.suppliers().map((s) => s.socialReason);
  isMaterialDisabled = computed(
    () => this.logisticsStore.selectedCategory().length === 0,
  );
  materialSelected = this.logisticsStore.getMaterialSelected;
}
