import {computed, inject, Injectable, signal} from '@angular/core';
import { InventoryMaterialEntity, InventoryViewModel } from '../domain/inventoryMaterial.entity';
import {LogisticsApi} from '../infrastructure/logistics.api';
import { RequestEntity, RequestViewModel } from '../domain/request.entity';
import { MachineryEntity } from '../domain/machinery.entity';
import { Supplier } from '../domain/supplier';
import { WasteEntity } from '../domain/waste.entity';
import { BudgetStore } from '../../budget/application/budget-store';
import { MaterialEntity } from '../domain/material.entity';
import { CategoryEntity } from '../domain/category.entity';

@Injectable({
  providedIn: 'root',
})
export class LogisticsStore {
  logisticsApi = inject(LogisticsApi);
  budgetStore = inject(BudgetStore);
  //MATERIAL
  private materialsSignal = signal<MaterialEntity[]>([]);
  private categoriesSignal = signal<CategoryEntity[]>([]);
  readonly filteredMaterials = computed(() => this.filteredMaterialsSignal());
  readonly categories = computed(() => this.categoriesSignal());
  private selectedCategorySignal = signal<string>('');
  private selectedMaterialSignal = signal<string>('');
  readonly selectedMaterial = computed(() => this.selectedMaterialSignal());
  setSelectedMaterial(materialName: string) {
    this.selectedMaterialSignal.set(materialName);
  }
  readonly categoryNames = computed(() => {
    return this.categoriesSignal()
      .filter((category) => category.isActive)
      .map((category) => category.name);
  });
  getMaterialSelected = computed<MaterialEntity | undefined>(()=>{
    const materialNameSelected = this.selectedMaterialSignal();
    const materials = this.materialsSignal;
    const materialSelected = materials().find(
      (material) => material.name === materialNameSelected)
    return materialSelected;
  })
  readonly filteredMaterialsSignal = computed(() => {
    const category = this.selectedCategorySignal();
    const allMaterials = this.materialsSignal();
    if (!category) {
      return allMaterials;
    }
    return allMaterials.filter((material) => material.category === category);
  });
  filterByCategory(category: string) {
    this.selectedCategorySignal.set(category);
  }
  // INVENTORY
  private inventorySignal = signal<InventoryMaterialEntity[]>([]);

  readonly selectedCategory = computed(() => this.selectedCategorySignal());

  readonly inventoryMaterials = computed(() => this.inventorySignal());
  readonly inventoryView = computed<InventoryViewModel[]>(() => {
    const catalogMaterials = this.materialsSignal();
    const inventory = this.inventorySignal();
    const categories = this.categoriesSignal();
    return inventory.map((invItem) => {
      const materialRelated = catalogMaterials.find(
        (material) => material.id === invItem.materialId,
      );
      const category = categories.find(
        (category) => category.id === materialRelated?.category,
      );
      return {
        ...invItem,
        materialName: materialRelated?.name || 'Material Unknown',
        materialCategory: category?.name || 'Without Category',
        materialUnit: materialRelated?.measureUnit || 'Without unit',
        materialSubcategory:
          materialRelated?.subcategory || 'Without Subcategory',
      };
    });
  });
  readonly filteredInventoryMaterials = computed(() => {
    const category = this.selectedCategorySignal();
    const allInventoryMaterials = this.inventoryView();
    if (!category) {
      return allInventoryMaterials;
    }
    return allInventoryMaterials.filter(
      (invItem) => invItem.materialCategory === category,
    );
  });
  readonly totalInventoryMaterials = computed(
    () => this.inventoryMaterials().length,
  );
  readonly criticalMaterialsCount = computed(
    () =>
      this.inventoryMaterials().filter(
        (invItem) => invItem.currentStock <= invItem.miniumStock,
      ).length,
  );
  loadMaterials() {
    if (this.inventorySignal().length === 0) {
      this.logisticsApi.getAllInventoryMaterials().subscribe((data) => {
        this.inventorySignal.set(data);
      });
    }
    if (this.materialsSignal().length === 0) {
      this.logisticsApi.getAllMaterials().subscribe((data) => {
        this.materialsSignal.set(data);
      });
    }
    if (this.categoriesSignal().length === 0) {
      this.logisticsApi.getAllCategories().subscribe((data) => {
        this.categoriesSignal.set(data);
      });
    }
  }

  clearFilter() {
    this.selectedCategorySignal.set('');
  }
  //REQUEST
  requestsSignal = signal<RequestEntity[]>([]);
  readonly requests = computed(() => this.requestsSignal());
  selectedRequestFilter = signal<string>('');
  readonly requestDetailsView = computed<RequestViewModel[]>(() => {
    const requests = this.requestsSignal();
    const materials = this.materialsSignal();
    const categories = this.categoriesSignal();
    return requests.map((request) => {
      const detailsItem = request.items.map((item) => {
        const material = materials.find(
          (material) => material.id === item.materialId,
        );
        const category = categories.find((c) => c.id === material?.category);
        return {
          ...item,
          materialId: material?.id || 'Unknown ID',
          materialName: material?.name || 'Unknown Name',
          materialCategory: category?.name || 'Without Category',
          materialUnit: material?.measureUnit || 'Without unit',
          materialSubcategory: material?.subcategory || 'Without Subcategory',
        };
      });
      return {
        ...request,
        items: detailsItem,
      };
    });
  });
  readonly requestFiltered = computed<RequestViewModel[]>(() => {
    const allRequest = this.requestDetailsView();
    const filter = this.selectedRequestFilter;
    if (!filter) {
      return allRequest;
    }
    const available = this.budgetStore.totalAvailable();
    const budgeted = this.budgetStore.totalBudgeted();
    switch (filter()) {
      case 'within-budget':
        return allRequest.filter((request) => {
          const nextAmount = request.items.reduce((total, item) => {
            return total + Math.ceil(item.quantity * item.pricePerUnit);
          }, 0);
          return nextAmount + available <= budgeted;
        });
      case 'out-budget': {
        return allRequest.filter((request) => {
          const nextAmount = request.items.reduce((total, item) => {
            return total + Math.ceil(item.quantity * item.pricePerUnit);
          }, 0);
          return nextAmount + available > budgeted;
        });
      }
      case 'expire-48h': {
        return allRequest.filter((request) => {
          const difference = new Date(request.deadline).getTime() - Date.now();
          return difference / (1000 * 60 * 60 * 24) <= 2;
        });
      }
      case 'all': {
        return allRequest;
      }
      default:
        return allRequest;
    }
  });
  filterRequest(filter: string) {
    this.selectedRequestFilter.set(filter);
  }
  loadRequest() {
    if (this.requestsSignal().length === 0) {
      this.logisticsApi.getAllRequest().subscribe((data) => {
        this.requestsSignal.set(data);
      });
    }
  }
  //Notifications
  readonly hasUnreadRequests = computed(() => this.requestsSignal().length > 0);
  readonly hasCriticalStock = computed(() =>
    this.inventorySignal().some(
      (invItem) => invItem.currentStock <= invItem.miniumStock,
    ),
  );
  readonly hasNotifications = computed(
    () => this.hasUnreadRequests() || this.hasCriticalStock(),
  );
  //Machinery
  private machinerySignal = signal<MachineryEntity[]>([]);
  readonly machinery = computed(() => this.machinerySignal());
  loadMachinery() {
    if (this.machinerySignal().length === 0) {
      this.logisticsApi.getAllMachinery().subscribe((data) => {
        this.machinerySignal.set(data);
      });
    }
  }
  //Suppliers
  suppliersSignal = signal<Supplier[]>([]);
  readonly suppliers = computed(() => this.suppliersSignal());
  loadSuppliers() {
    if (this.suppliersSignal().length === 0) {
      this.logisticsApi.getAllSuppliers().subscribe((data) => {
        this.suppliersSignal.set(data);
      });
    }
  }
  numberSuppliersActive = computed(() => {
    const activeSuppliers = this.suppliersSignal().filter(
      (supplier) => supplier.status === 'active',
    );
    return activeSuppliers.length;
  });
  //Waste
  wasteSignal = signal<WasteEntity[]>([]);
  readonly waste = computed(() => this.wasteSignal());
  loadWaste() {
    if (this.wasteSignal().length === 0) {
      this.logisticsApi.getAllWaste().subscribe((data) => {
        this.wasteSignal.set(data);
      });
    }
  }
}
