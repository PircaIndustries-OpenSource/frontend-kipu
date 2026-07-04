import { computed, inject, Injectable, signal, effect } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { InventoryMaterialEntity } from '../domain/inventoryMaterial.entity';
import { LogisticsApi } from '../infrastructure/logistics.api';
import { RequestEntity } from '../domain/request.entity';
import { MachineryEntity, MachineryCatalogEntity } from '../domain/machinery.entity';
import { ProjectsStore } from '../../projects/application/projects.store';
import { SupplierEntity } from '../domain/supplier.entity';
import { WasteEntity } from '../domain/waste.entity';
import { BudgetStore } from '../../budget/application/budget-store';
import { MaterialEntity } from '../domain/material.entity';
import { CategoryEntity } from '../domain/category.entity';
import { SupplierOfferEntity } from '../domain/supplierOffer.entity';

export type EnrichedRequestItem = import('../domain/request.entity').RequestItem & {
  materialName: string;
  categoryName: string;
  materialUnit: string;
  materialSubcategory: string;
  pricePerUnit: number;
};

export type EnrichedRequest = Omit<RequestEntity, 'items'> & {
  items: EnrichedRequestItem[];
};

export type InventoryView = InventoryMaterialEntity & {
  materialName: string;
  materialCategory: string;
  materialUnit: string;
  materialSubcategory: string;
};

export type WasteView = WasteEntity & {
  materialName: string;
  materialUnit: string;
};

@Injectable({
  providedIn: 'root',
})
export class LogisticsStore {
  logisticsApi = inject(LogisticsApi);
  budgetStore = inject(BudgetStore);
  private projectsStore = inject(ProjectsStore);

  constructor() {
    effect(() => {
      const activeId = this.projectsStore.currentProjectId();
      if (activeId) {
        this.loadInventoryMaterials(true);
        this.loadRequest(true);
        this.loadMachinery(true);
        this.loadWaste(true);
        this.loadMaterials(true);
        this.loadCategories(true);
        this.loadSupplierOffers(true);
        this.loadSuppliers(true);
        this.loadMachineryCatalog(true);
      } else {
        this.inventorySignal.set([]);
        this.requestsSignal.set([]);
        this.machinerySignal.set([]);
        this.machineryCatalogSignal.set([]);
        this.wasteSignal.set([]);
      }
    });
  }

  //MATERIAL
  private materialsSignal = signal<MaterialEntity[]>([]);
  private categoriesSignal = signal<CategoryEntity[]>([]);
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
  getMaterialSelected = computed<MaterialEntity | undefined>(() => {
    const materialNameSelected = this.selectedMaterialSignal();
    const materials = this.materialsSignal;
    return materials().find((material) => material.name === materialNameSelected);
  });
  private filteredMaterialsSignal = computed(() => {
    const categories = this.categoriesSignal();
    const activeCategories = categories.filter((c) => c.isActive);
    const categoryRelatedByName = activeCategories.find(
      (c) => c.name === this.selectedCategorySignal(),
    );
    const allMaterials = this.materialsSignal();
    if (!categoryRelatedByName) {
      return allMaterials;
    }
    return allMaterials.filter((material) => material.categoryId === categoryRelatedByName.id);
  });
  readonly filteredMaterials = this.filteredMaterialsSignal;
  filterByCategory(category: string) {
    this.selectedCategorySignal.set(category);
  }
  // INVENTORY
  private inventorySignal = signal<InventoryMaterialEntity[]>([]);
  private criticalStockFilterSignal = signal<boolean>(false);
  readonly criticalStockFilter = computed(() => this.criticalStockFilterSignal());
  private selectedInventoryMaterialSignal = signal<string>('');
  readonly selectedInventoryMaterial = computed(() => this.selectedInventoryMaterialSignal());
  getInventoryMaterialSelected = computed<InventoryView | undefined>(() => {
    const inventoryMaterialNameSelected = this.selectedInventoryMaterialSignal();
    const materials = this.inventoryView;
    return materials().find((material) => material.materialName === inventoryMaterialNameSelected);
  });
  setInventorySelectedMaterial(inventoryMaterialName: string) {
    this.selectedInventoryMaterialSignal.set(inventoryMaterialName);
  }
  toggleCriticalStockFilter() {
    this.criticalStockFilterSignal.update((v) => !v);
  }

  readonly selectedCategory = computed(() => this.selectedCategorySignal());

  readonly inventoryMaterials = computed(() => this.inventorySignal());
  readonly inventoryView = computed<InventoryView[]>(() => {
    const catalogMaterials = this.materialsSignal();
    const inventory = this.inventorySignal();
    const categories = this.categoriesSignal().filter((c) => c.isActive);
    return inventory.map((invItem) => {
      const materialRelated = catalogMaterials.find(
        (material) => material.id === invItem.materialId,
      );
      const category = categories.find((category) => category.id === materialRelated?.categoryId);
      return {
        ...invItem,
        materialName: materialRelated?.name || 'Material Unknown',
        materialCategory: category?.name || 'Without Category',
        materialUnit: materialRelated?.measureUnit || 'Without unit',
        materialSubcategory: materialRelated?.subcategory || 'Without Subcategory',
      };
    });
  });
  readonly filteredInventoryMaterials = computed(() => {
    let result = this.inventoryView();
    const category = this.selectedCategorySignal();
    if (category) {
      result = result.filter((i) => i.materialCategory === category);
    }
    if (this.criticalStockFilterSignal()) {
      result = result.filter((i) => i.currentStock <= i.miniumStock);
    }
    return result;
  });
  readonly totalInventoryMaterials = computed(() => this.inventoryMaterials().length);
  readonly criticalMaterialsCount = computed(
    () =>
      this.inventoryMaterials().filter((invItem) => invItem.currentStock <= invItem.miniumStock)
        .length,
  );

  loadMaterials(force = false) {
    if (force || this.materialsSignal().length === 0) {
      this.logisticsApi.getAllMaterials().subscribe((data) => {
        this.materialsSignal.set(data);
      });
    }
  }
  loadInventoryMaterials = (force = false) => {
    if (force || this.inventorySignal().length === 0) {
      this.logisticsApi.getAllInventoryMaterials().subscribe((data) => {
        this.inventorySignal.set(data);
      });
    }
  };
  loadCategories(force = false) {
    if (force || this.categoriesSignal().length === 0) {
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

  readonly requestDetailsView = computed<EnrichedRequest[]>(() => {
    const requests = this.requestsSignal();
    const materials = this.materialsSignal();
    const categories = this.categoriesSignal();
    const supplierOffer = this.supplierOfferSignal();

    return requests.map((request) => {
      const detailsItem = request.items.map((item) => {
        const supplierOfferRelated = supplierOffer.find((s) => s.id === item.supplierOfferId);
        const material = materials.find((m) => m.id === supplierOfferRelated?.materialId);
        const category = categories.find((c) => c.id === material?.categoryId);
        return {
          ...item,
          materialName: material?.name || 'Unknown Name',
          categoryName: category?.name || 'Unknown Category',
          materialUnit: material?.measureUnit || 'Without unit',
          materialSubcategory: material?.subcategory || 'Without Subcategory',
          pricePerUnit: supplierOfferRelated?.unitPrice || 0,
        };
      });
      return {
        ...request,
        items: detailsItem,
      };
    });
  });
  readonly requestFiltered = computed<EnrichedRequest[]>(() => {
    let result = this.requestDetailsView();
    const filter = this.selectedRequestFilter;
    if (!filter) {
      return result;
    }
    const available = this.budgetStore.totalAvailable();
    if (this.pendingRequestFilterSignal()) {
      result = result.filter((i) => i.status === 'PENDING');
    }
    if (this.approvedRequestFilterSignal()) {
      result = result.filter((i) => i.status === 'APPROVED');
    }
    if (this.refusedRequestFilterSignal()) {
      result = result.filter((i) => i.status === 'REFUSED');
    }
    switch (filter()) {
      case 'within-budget':
        return result.filter((request) => {
          const nextAmount = request.items.reduce((total, item) => {
            return total + Math.ceil(item.quantity * item.pricePerUnit);
          }, 0);
          return nextAmount <= available;
        });
      case 'out-budget': {
        return result.filter((request) => {
          const nextAmount = request.items.reduce((total, item) => {
            return total + Math.ceil(item.quantity * item.pricePerUnit);
          }, 0);
          return nextAmount > available;
        });
      }
      case 'expire-48h': {
        return result.filter((request) => {
          const difference = new Date(request.deadline).getTime() - Date.now();
          const result = difference / (1000 * 60 * 60 * 24);
          return result <= 2 && result >= 0;
        });
      }
      case 'all': {
        return result;
      }
      default:
        return result;
    }
  });
  filterRequest(filter: string) {
    this.selectedRequestFilter.set(filter);
  }
  loadRequest(force = false) {
    if (force || this.requestsSignal().length === 0) {
      this.logisticsApi.getAllRequest().subscribe((data) => {
        this.requestsSignal.set(data);
      });
    }
  }
  getSupplierOfferByMaterialIdAndSupplierId = computed<SupplierOfferEntity | undefined>(() => {
    const supplierOffer = this.supplierOfferSignal();
    const materialSelectedId = this.getMaterialSelected()?.id;
    const supplierSelectedId = this.getSupplierSelected()?.id;
    if (!materialSelectedId || !supplierSelectedId) {
      return undefined;
    }
    return supplierOffer.find(
      (sf) => sf.supplierId === supplierSelectedId && sf.materialId === materialSelectedId,
    );
  });
  addRequest(request: RequestEntity, onSuccess?: () => void) {
    this.logisticsApi.postRequest(request).subscribe({
      next: (newRequest) => {
        this.requestsSignal.update((prev) => [...prev, newRequest]);
        onSuccess?.();
      },
      error: (err) => {
        console.error('Error adding request', err);
      },
    });
  }
  updateRequest(id: string, updates: Partial<RequestEntity>, onSuccess?: () => void) {
    this.logisticsApi.patchRequest(id, updates).subscribe({
      next: (updated) => {
        this.requestsSignal.update((prev) => prev.map((r) => (r.id === id ? updated : r)));
        onSuccess?.();
      },
      error: (err) => {
        console.error('Error updating request:', err);
      },
    });
  }

  private pendingRequestFilterSignal = signal<boolean>(false);
  private approvedRequestFilterSignal = signal<boolean>(false);
  private refusedRequestFilterSignal = signal<boolean>(false);
  readonly pendingRequestFilter = computed(() => this.pendingRequestFilterSignal());
  readonly approvedRequestFilter = computed(() => this.approvedRequestFilterSignal());
  readonly refusedRequestFilter = computed(() => this.refusedRequestFilterSignal());
  togglePendingRequestFilter() {
    this.pendingRequestFilterSignal.update((v) => !v);
    this.approvedRequestFilterSignal.set(false);
    this.refusedRequestFilterSignal.set(false);
  }

  toggleApprovedRequestFilter() {
    this.approvedRequestFilterSignal.update((v) => !v);
    this.pendingRequestFilterSignal.set(false);
    this.refusedRequestFilterSignal.set(false);
  }

  toggleRefusedRequestFilter() {
    this.refusedRequestFilterSignal.update((v) => !v);
    this.pendingRequestFilterSignal.set(false);
    this.approvedRequestFilterSignal.set(false);
  }
  //Notifications
  readonly hasUnreadRequests = computed(() => this.requestsSignal().length > 0);
  readonly hasCriticalStock = computed(() =>
    this.inventorySignal().some((invItem) => invItem.currentStock <= invItem.miniumStock),
  );
  readonly hasNotifications = computed(() => this.hasUnreadRequests() || this.hasCriticalStock());
  //Machinery Catalog
  private machineryCatalogSignal = signal<MachineryCatalogEntity[]>([]);
  readonly machineryCatalog = computed(() => this.machineryCatalogSignal());

  loadMachineryCatalog(force = false) {
    if (force || this.machineryCatalogSignal().length === 0) {
      this.logisticsApi.getAllMachineryCatalog().subscribe({
        next: (data) => this.machineryCatalogSignal.set(data),
        error: (err) => console.error('Error loading machinery catalog', err),
      });
    }
  }

  addCatalogItem(item: any, onSuccess?: () => void) {
    this.logisticsApi.postMachineryCatalog(item).subscribe({
      next: (newItem) => {
        this.machineryCatalogSignal.update((prev) => [...prev, newItem]);
        onSuccess?.();
      },
      error: (err) => console.error('Error adding catalog item', err),
    });
  }

  //Machinery
  private machinerySignal = signal<MachineryEntity[]>([]);
  readonly machinery = computed(() => this.machinerySignal());
  loadMachinery(force = false) {
    if (force || this.machinerySignal().length === 0) {
      this.logisticsApi.getAllMachinery().subscribe((data) => {
        this.machinerySignal.set(data);
      });
    }
  }
  addMachinery(machinery: MachineryEntity, onSuccess?: () => void) {
    this.logisticsApi.postMachinery(machinery).subscribe({
      next: (newMachinery) => {
        this.machinerySignal.update((prev) => [...prev, newMachinery]);
        onSuccess?.();
      },
      error: (err) => console.error('Error adding machinery', err),
    });
  }
  updateMachinery(id: string, updates: Partial<MachineryEntity>): Observable<MachineryEntity> {
    return this.logisticsApi.patchMachinery(id, updates).pipe(
      tap((updated) => {
        this.machinerySignal.update((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updated } : m)),
        );
      }),
      catchError((err) => {
        console.error('Error updating machinery, applying locally', err);
        this.machinerySignal.update((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        );
        return of(updates as MachineryEntity);
      }),
    );
  }
  //SUPPLIERS OFFER
  supplierOfferSignal = signal<SupplierOfferEntity[]>([]);
  readonly supplierOffer = computed(() => this.supplierOfferSignal());
  loadSupplierOffers(force = false) {
    if (force || this.supplierOfferSignal().length === 0) {
      this.logisticsApi.getAllSupplierOffer().subscribe((data) => {
        this.supplierOfferSignal.set(data);
      });
    }
  }
  getSupplierByMaterial(material: MaterialEntity | undefined) {
    if (!material) {
      return [];
    }
    const supplierOffer = this.supplierOfferSignal();
    const suppliers = this.suppliersSignal();
    const supplierOfferRelated = supplierOffer.filter((sf) => sf.materialId === material.id);
    const relatedSuppliers = supplierOfferRelated.map((sf) => sf.supplierId);
    return suppliers.filter((s) => relatedSuppliers.includes(s.id));
  }
  //Suppliers
  suppliersSignal = signal<SupplierEntity[]>([]);
  readonly suppliers = computed(() => this.suppliersSignal());
  loadSuppliers(force = false) {
    if (force || this.suppliersSignal().length === 0) {
      this.logisticsApi.getAllSuppliers().subscribe((data) => {
        this.suppliersSignal.set(data);
      });
    }
  }
  addSupplier(supplier: SupplierEntity, onSuccess?: () => void) {
    this.logisticsApi.postSupplier(supplier).subscribe({
      next: (newSupplier) => {
        this.suppliersSignal.update((prev) => [...prev, newSupplier]);
        onSuccess?.();
      },
      error: (err) => console.error('Error adding supplier', err),
    });
  }
  updateSupplier(id: string, updates: Partial<SupplierEntity>, onSuccess?: () => void) {
    this.logisticsApi.patchSupplier(id, updates).subscribe({
      next: (updated) => {
        this.suppliersSignal.update((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...updated } : s)),
        );
        onSuccess?.();
      },
      error: (err) => {
        console.error('Error updating supplier, applying locally', err);
        this.suppliersSignal.update((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        );
        onSuccess?.();
      },
    });
  }
  deleteSupplier(id: string) {
    this.logisticsApi.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliersSignal.update((prev) => prev.filter((s) => s.id !== id));
      },
      error: (err) => console.error('Error deleting supplier', err),
    });
  }
  numberSuppliersActive = computed(() => {
    const activeSuppliers = this.suppliersSignal().filter(
      (supplier) => supplier.status === 'ACTIVE',
    );
    return activeSuppliers.length;
  });
  numberSuppliersInactive = computed(() => {
    const inactiveSuppliers = this.suppliersSignal().filter(
      (supplier) => supplier.status === 'INACTIVE',
    );
    return inactiveSuppliers.length;
  });
  selectedSupplier = signal<string>('');
  setSelectedSupplier = (supplierSocialReason: string) => {
    this.selectedSupplier.set(supplierSocialReason);
  };
  getSupplierSelected = computed(() => {
    const suppliers = this.suppliersSignal();
    return suppliers.find((s) => s.socialReason === this.selectedSupplier());
  });
  private activeSupplierFilterSignal = signal<boolean>(false);
  readonly activeSupplierFilter = computed(() => this.activeSupplierFilterSignal());

  toggleActiveSupplierFilter() {
    this.activeSupplierFilterSignal.update((v) => !v);
    this.inactiveSupplierFilterSignal.set(false);
  }
  private inactiveSupplierFilterSignal = signal<boolean>(false);
  readonly inactiveSupplierFilter = computed(() => this.inactiveSupplierFilterSignal());

  toggleInactiveSupplierFilter() {
    this.inactiveSupplierFilterSignal.update((v) => !v);
    this.activeSupplierFilterSignal.set(false);
  }
  searchRuc = signal('');
  readonly filteredSuppliers = computed(() => {
    let result = this.suppliers();
    const ruc = this.searchRuc().trim();
    if (ruc) result = result.filter((s) => s.ruc.includes(ruc));
    if (this.inactiveSupplierFilterSignal()) result = result.filter((s) => s.status === 'INACTIVE');
    if (this.activeSupplierFilterSignal()) result = result.filter((s) => s.status === 'ACTIVE');
    return result;
  });
  //Waste
  wasteSignal = signal<WasteEntity[]>([]);
  readonly waste = computed(() => this.wasteSignal());
  readonly wasteView = computed<WasteView[]>(() => {
    const inventory = this.inventoryView();
    return this.wasteSignal().map((w) => {
      const material = inventory.find((i) => i.materialId === w.materialId);
      return {
        ...w,
        materialName: material?.materialName ?? 'Unknown',
        materialUnit: material?.materialUnit ?? '',
      };
    });
  });
  loadWaste(force = false) {
    if (force || this.wasteSignal().length === 0) {
      this.logisticsApi.getAllWaste().subscribe((data) => {
        this.wasteSignal.set(data);
      });
    }
  }
  addWaste(waste: WasteEntity, onSuccess?: () => void) {
    this.logisticsApi.postWaste(waste).subscribe({
      next: (newWaste) => {
        this.wasteSignal.update((prev) => [...prev, newWaste]);
        onSuccess?.();
      },
      error: (err) => console.error('Error adding waste', err),
    });
  }
}
