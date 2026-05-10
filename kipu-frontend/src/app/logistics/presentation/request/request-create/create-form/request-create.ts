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
import { MaterialEntity } from '../../../../domain/material.entity';
import { RequestEntity } from '../../../../domain/request.entity';
import { MatDialog } from '@angular/material/dialog';
import { RequestSuccessDialog } from '../request-success-dialog/request-success-dialog';
import { Router } from '@angular/router';
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
export class RequestCreate implements OnInit {
  dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);

  ngOnInit() {
    this.logisticsStore.loadCategories();
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadSuppliers();
  }
  router = inject(Router);
  goToRequestPage() {
    this.router.navigate(['/logistics/requests']).then();
  }
  requestForm: FormGroup = this.fb.group({
    category: ['', Validators.required],
    material: ['', Validators.required],
    supplier: ['', Validators.required],
    budgetLine: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
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

  constructor() {
    this.requestForm.get('quantity')?.valueChanges.subscribe((val) => this.quantity.set(val ?? 1));
  }

  categories = this.logisticsStore.categories;
  materials = this.logisticsStore.filteredMaterials;
  nameCategories = computed<string[]>(() => this.categories().map((category) => category.name));
  nameMaterials = computed<string[]>(() => this.materials().map((material) => material.name));
  nameBudgetLines = computed(() => this.budgetStore.budgetItems().map((b) => `${b.code} - ${b.name}`));
  suppliersByMaterial = computed(() => {
    const material = this.materialSelected();
    if (!material) return [];
    return this.logisticsStore.getSupplierByMaterial(material);
  });
  nameSuppliers = computed<string[]>(() => this.suppliersByMaterial().map((s) => s.socialReason));
  budgetedAmount = computed(() => {
    const offer = this.logisticsStore.getSupplierOfferByMaterialIdAndSupplierId();
    const quantity = this.quantity();
    if (!offer || !quantity || quantity <= 0) return 0;
    return Math.round(quantity * offer.unitPrice * 100) / 100;
  });

  executedAmount = this.budgetStore.totalExecuted;
  availableAmount = this.budgetStore.totalAvailable;
  supplierOffer = computed(() => {
    return this.logisticsStore.getSupplierOfferByMaterialIdAndSupplierId();
  });

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
  onBudgetLineSelect(budgetLine: string) {
    this.selectedBudgetLine.set(budgetLine);
    this.requestForm.get('budgetLine')?.setValue(budgetLine);
  }
  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const formValue = this.requestForm.value;
    const request = new RequestEntity();

    request.items = [
      {
        supplierOfferId: this.supplierOffer()?.id ?? '',
        quantity: formValue.quantity ?? 1,
      },
    ];
    request.suggestedSupplierId = this.supplierSelected()?.id ?? '';
    request.budgetLineId = this.selectedBudgetLine();
    request.priority = formValue.priority ?? 1;
    request.deliveryLocation = formValue.deliveryLocation ?? '';
    request.purpose = formValue.purpose ?? '';
    request.additionalNotes = formValue.additionalNotes ?? '';
    request.requestDate = new Date().toISOString().split('T')[0];
    request.deadline = formValue.requiredDate ?? '';

    this.logisticsStore.addRequest(request, () => {
      this.dialog.open(RequestSuccessDialog, {
        width: '25rem',
        disableClose: true,
      });
    });
  }

  selectedUnit = computed(() => this.materialSelected()?.measureUnit);
  isMaterialDisabled = computed(() => this.logisticsStore.selectedCategory().length === 0);
  isSupplierDisabled = computed(() => this.logisticsStore.selectedMaterial().length === 0);
  materialSelected = computed(() => {
    return this.logisticsStore.getMaterialSelected();
  });
  supplierSelected = computed(() => {
    return this.logisticsStore.getSupplierSelected();
  });
}
