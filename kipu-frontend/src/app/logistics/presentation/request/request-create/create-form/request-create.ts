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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestEntity } from '../../../../domain/request.entity';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../../identity/application/auth.store';
import { SuccessDialog } from '../../../../../shared/presentation/success-dialog/success-dialog';
import { ProgressStore } from '../../../../../progress/application/progress.store';
import { BudgetItemEntity } from '../../../../../budget/domain/budget-item.entity';

@Component({
  selector: 'app-request-create',
  standalone: true,
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
export class RequestCreate implements OnInit {
  dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);
  progressStore = inject(ProgressStore); // Added ProgressStore
  authStore = inject(AuthStore);
  router = inject(Router);

  ngOnInit() {
    this.logisticsStore.loadCategories();
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadSuppliers();
    this.progressStore.loadProgress(); // Load progress entries from db.json
    this.budgetStore.loadBudgetItems(); // Load budget items from db.json
  }

  goToRequestPage() {
    this.router.navigate(['/logistics/requests']).then();
  }

  requestForm: FormGroup = this.fb.group({
    category: ['', Validators.required],
    material: ['', Validators.required],
    supplier: ['', Validators.required],
    budgetLine: [''],
    quantity: ['1', [Validators.required, Validators.min(1)]],
    priority: ['', Validators.required],
    requiredDate: ['', Validators.required],
    deliveryLocation: ['', Validators.required],
    purpose: ['', Validators.required],
    additionalNotes: [''],
  });

  materialResetCounter = signal(0);
  supplierResetCounter = signal(0);
  quantity = signal(1);
  selectedBudgetLine = signal('');
  selectedBudgetItem = signal<BudgetItemEntity | null>(null); // Track the linked budget line

  constructor() {
    this.requestForm.get('quantity')?.valueChanges.subscribe((val) => this.quantity.set(val ?? 1));
  }

  categories = this.logisticsStore.categories;
  materials = this.logisticsStore.filteredMaterials;
  nameCategories = computed<string[]>(() => this.categories().map((category) => category.name));
  nameMaterials = computed<string[]>(() => this.materials().map((material) => material.name));

  nameBudgetLines = computed(() => this.budgetStore.budgetItems().map((b) => b.name));

  suppliersByMaterial = computed(() => {
    const material = this.materialSelected();
    if (!material) return [];
    return this.logisticsStore.getSupplierByMaterial(material);
  });

  nameSuppliers = computed<string[]>(() => this.suppliersByMaterial().map((s) => s.socialReason));

  // Current Material Request cost (Qty * Unit Price)
  requestCost = computed(() => {
    const offer = this.logisticsStore.getSupplierOfferByMaterialIdAndSupplierId();
    const quantity = this.quantity();
    if (!offer || !quantity || quantity <= 0) return 0;
    return Math.round(quantity * offer.unitPrice * 100) / 100;
  });

  // Reactive verification signals based on selected activity
  assignedBudget = computed(() => this.selectedBudgetItem()?.budgeted || 0);
  executedAmount = computed(() => this.selectedBudgetItem()?.executed || 0);
  availableAmount = computed(() => this.selectedBudgetItem()?.available || 0);
  isOverBudget = computed(() => this.requestCost() > this.availableAmount());

  supplierOffer = computed(() => {
    return this.logisticsStore.getSupplierOfferByMaterialIdAndSupplierId();
  });
  unitPrice = computed(() => this.supplierOffer()?.unitPrice ?? 0);

  onCategoryMaterialSelect(category: string) {
    this.logisticsStore.filterByCategory(category);
    this.requestForm.get('category')?.setValue(category);
    this.materialResetCounter.update((v) => v + 1);
  }

  onMaterialSelect(materialName: string) {
    this.logisticsStore.setSelectedMaterial(materialName);
    this.requestForm.get('material')?.setValue(materialName);
    this.supplierResetCounter.update((v) => v + 1);
  }

  onSupplierSelect(supplierSocialReason: string) {
    this.logisticsStore.setSelectedSupplier(supplierSocialReason);
    this.requestForm.get('supplier')?.setValue(supplierSocialReason);
  }

  onBudgetLineSelect(budgetName: string) {
    this.selectedBudgetLine.set(budgetName);
    this.requestForm.get('budgetLine')?.setValue(budgetName);
    const item = this.budgetStore.budgetItems().find((b) => b.name === budgetName);
    this.selectedBudgetItem.set(item || null);
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const formValue = this.requestForm.value;
    const offer = this.supplierOffer();
    if (!offer) {
      console.error('No supplier offer found for selected material and supplier');
      return;
    }

    const body = {
      deadline: formValue.requiredDate,
      requestPriority: formValue.priority,
      deliveryLocation: formValue.deliveryLocation,
      budgetLineId: this.selectedBudgetItem()?.id ?? null,
      purpose: formValue.purpose,
      additionalNotes: formValue.additionalNotes ?? '',
      requestedBy: Number(this.authStore.userId()) || 1,
      items: [{
        materialCatalogId: Number(offer.materialId),
        supplierId: Number(offer.supplierId),
        quantity: formValue.quantity ?? 1,
        unitPrice: offer.unitPrice,
      }],
    };

    this.logisticsStore.addRequest(body, () => {
      this.dialog.open(SuccessDialog, {
        width: '25rem',
        disableClose: true,
        data: {
          title: 'request.create.success.title',
          subtitle: 'request.create.success.message',
          textButton: 'request.create.success.close',
        },
      });
    });
  }

  measureUnitLabels: Record<string, string> = {
    UNIT: 'und',
    PIECE: 'pza',
    TON: 'ton',
    METER: 'm',
    LINEAR_METER: 'ml',
    SQUARE_METER: 'm2',
    CUBIC_METER: 'm3',
    LITER: 'l',
    GALLON: 'gal',
    BAG: 'bol',
    ROLL: 'rll',
    ROD: 'var',
    SHEET: 'plan',
    BUCKET: 'bal',
    BOX: 'cja',
  };

  selectedUnit = computed(() => {
    const unit = this.materialSelected()?.measureUnit;
    return unit ? this.measureUnitLabels[unit] || unit : undefined;
  });
  isMaterialDisabled = computed(() => this.logisticsStore.selectedCategory().length === 0);
  isSupplierDisabled = computed(() => this.logisticsStore.selectedMaterial().length === 0);
  materialSelected = computed(() => this.logisticsStore.getMaterialSelected());
  supplierSelected = computed(() => this.logisticsStore.getSupplierSelected());

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d !== null && d >= today;
  };
}
