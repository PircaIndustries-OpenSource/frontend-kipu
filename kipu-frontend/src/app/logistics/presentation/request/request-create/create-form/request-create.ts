import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { TeamUsersStore } from '../../../../../team/team-users/application/team-users.store';
import { SuccessDialog } from '../../../../../shared/presentation/success-dialog/success-dialog';
import { ProgressStore } from '../../../../../progress/application/progress.store';
import { BudgetItemEntity } from '../../../../../budget/domain/budget-item.entity';
import { AutocompleteFilterList } from '../../../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';

@Component({
  selector: 'app-request-create',
  standalone: true,
  imports: [
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatSelect,
    MatOption,
    MatIcon,
    MatRippleModule,
    DecimalPipe,
    ReactiveFormsModule,
    AutocompleteFilterList,
  ],
  templateUrl: './request-create.html',
  styleUrl: './request-create.css',
})
export class RequestCreate implements OnInit {
  dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  logisticsStore = inject(LogisticsStore);
  budgetStore = inject(BudgetStore);
  progressStore = inject(ProgressStore);
  authStore = inject(AuthStore);
  teamUsersStore = inject(TeamUsersStore);
  router = inject(Router);

  ngOnInit() {
    const role = this.teamUsersStore.currentUser()?.role;
    if (role === 'Logística') {
      this.router.navigate(['/logistics/requests']);
      return;
    }
    this.logisticsStore.loadCategories();
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadSupplierOffers();
    this.logisticsStore.loadSuppliers();
    this.progressStore.loadProgress();
    this.budgetStore.loadBudgetItems();
  }

  goToRequestPage() {
    this.router.navigate(['/logistics/requests']).then();
  }

  requestForm: FormGroup = this.fb.group({
    category: ['', Validators.required],
    material: ['', Validators.required],
    supplier: ['', Validators.required],
    budgetLine: ['', Validators.required],
    quantity: ['1', [Validators.required, Validators.min(1)]],
    priority: ['', Validators.required],
    requiredDate: ['', Validators.required],
    deliveryLocation: ['', Validators.required],
    purpose: ['', Validators.required],
    additionalNotes: [''],
  });

  quantity = signal(1);
  selectedBudgetLine = signal('');
  selectedBudgetItem = signal<BudgetItemEntity | null>(null);
  minDate: Date;

  constructor() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow;
    this.requestForm.get('quantity')?.valueChanges.subscribe((val) => this.quantity.set(val ?? 1));
  }

  categories = this.logisticsStore.categories;
  materials = this.logisticsStore.filteredMaterials;
  nameCategories = computed<string[]>(() => this.categories().map((category) => category.name));
  nameMaterials = computed<string[]>(() => this.materials().map((material) => material.name));

  nameBudgetLines = computed(() => this.progressStore.progressList().map((p) => p.activityName));

  suppliersByMaterial = computed(() => {
    const material = this.materialSelected();
    if (!material) return [];
    return this.logisticsStore.getSupplierByMaterial(material);
  });

  nameSuppliers = computed<string[]>(() => this.suppliersByMaterial().map((s) => s.socialReason));

  requestCost = computed(() => {
    const offer = this.logisticsStore.getSupplierOfferByMaterialIdAndSupplierId();
    const quantity = this.quantity();
    if (!offer || !quantity || quantity <= 0) return 0;
    return Math.round(quantity * offer.unitPrice * 100) / 100;
  });

  assignedBudget = computed(() => this.selectedBudgetItem()?.budgeted || 0);
  executedAmount = computed(() => this.selectedBudgetItem()?.executed || 0);
  availableAmount = computed(() => this.selectedBudgetItem()?.available || 0);
  isOverBudget = computed(() => this.requestCost() > this.availableAmount());

  supplierOffer = computed(() => {
    return this.logisticsStore.getSupplierOfferByMaterialIdAndSupplierId();
  });

  onCategoryMaterialSelect(category: string) {
    this.logisticsStore.filterByCategory(category);
    this.requestForm.get('category')?.setValue(category);
    this.requestForm.get('material')?.reset('');
    this.requestForm.get('supplier')?.reset('');
  }

  onMaterialSelect(materialName: string) {
    this.logisticsStore.setSelectedMaterial(materialName);
    this.requestForm.get('material')?.setValue(materialName);
    this.requestForm.get('supplier')?.reset('');
  }

  onSupplierSelect(supplierName: string) {
    this.logisticsStore.setSelectedSupplier(supplierName);
    this.requestForm.get('supplier')?.setValue(supplierName);
  }

  materialSelected = computed(() => this.logisticsStore.getMaterialSelected());
  supplierSelected = computed(() => this.logisticsStore.getSupplierSelected());

  isMaterialDisabled = computed(() => this.logisticsStore.selectedCategory().length === 0);
  isSupplierDisabled = computed(() => this.logisticsStore.selectedMaterial().length === 0);

  /**
   * Links the selected Progress Activity to its corresponding Budget Line
   */
  onBudgetLineSelect(activityName: string) {
    this.selectedBudgetLine.set(activityName);
    this.requestForm.get('budgetLine')?.setValue(activityName);

    // Find progress by activity name to get its ID
    const progress = this.progressStore.progressList().find((p) => p.activityName === activityName);
    if (progress) {
      // Find the budget item that shares the same progressId
      const budgetItem = this.budgetStore.budgetItems().find((b) => b.progressId === progress.id);
      this.selectedBudgetItem.set(budgetItem || null);
    } else {
      this.selectedBudgetItem.set(null);
    }
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    const formValue = this.requestForm.value;
    const request = new RequestEntity();

    const offer = this.supplierOffer();
    request.items = [
      {
        materialCatalogId: Number(this.materialSelected()?.id) || 0,
        supplierId: Number(offer?.supplierId) || 0,
        quantity: formValue.quantity ?? 1,
        unitPrice: offer?.unitPrice ?? 0,
      },
    ];
    request.suggestedSupplierId = this.supplierSelected()?.id ?? '';
    request.budgetLineId = this.selectedBudgetLine();
    request.priority = formValue.priority ?? 'LOW';
    request.deliveryLocation = formValue.deliveryLocation ?? '';
    request.purpose = formValue.purpose ?? '';
    request.additionalNotes = formValue.additionalNotes ?? '';
    request.requestDate = new Date().toISOString().split('T')[0];
    request.deadline = formValue.requiredDate ?? '';
    request.requestedBy = this.authStore.userName();
    request.projectId = localStorage.getItem('currentProjectId') || '';
    request.status = 'PENDING';

    this.logisticsStore.addRequest(request, () => {
      this.dialog.open(SuccessDialog, {
        width: '25rem',
        disableClose: true,
        data: {
          title: 'request.create.success.title',
          subtitle: 'request.create.success.message',
          textButton: 'request.create.success.close',
        },
      }).afterClosed().subscribe(() => {
        this.goToRequestPage();
      });
    });
  }

  selectedUnit = computed(() => this.materialSelected()?.measureUnit);

  uploadedDocumentName: string | null = null;
  uploadedDocumentFile: File | null = null;

  onDocumentUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadedDocumentName = file.name;
      this.uploadedDocumentFile = file;
    }
  }
}
