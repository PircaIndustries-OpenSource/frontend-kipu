import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  AutocompleteFilterList
} from '../../../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LogisticsStore } from '../../../../application/logistics.store';
import { MatOption, MatSelect } from '@angular/material/select';

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
  ],
  templateUrl: './request-create.html',
  styleUrl: './request-create.css',
})
export class RequestCreate {
  logisticsStore = inject(LogisticsStore);
  categories = this.logisticsStore.categories;
  materials = this.logisticsStore.filteredMaterials;
  nameCategories = this.categories().map((category) => category.name);
  nameMaterials = this.materials().map((material) => material.materialName);
  onCategoryMaterialSelect(category: string) {
    this.logisticsStore.filterByCategory(category);
  }
}
