import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BudgetStore } from '../../application/budget-store';
import { BudgetItemEntity } from '../../domain/budget-item.entity';

@Component({
  selector: 'app-budget-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './budget-page.html',
})
export class BudgetPage implements OnInit {
  protected readonly store = inject(BudgetStore);
  private readonly fb = inject(FormBuilder);
  protected readonly dialog = inject(MatDialog);

  expenseForm: FormGroup;
  extensionForm: FormGroup;
  errorMessage: string | null = null;

  @ViewChild('expenseTpl') expenseTpl!: TemplateRef<any>;
  @ViewChild('extensionTpl') extensionTpl!: TemplateRef<any>;
  @ViewChild('detailTpl') detailTpl!: TemplateRef<any>;
  @ViewChild('expensesListTpl') expensesListTpl!: TemplateRef<any>;
  @ViewChild('confirmTpl') confirmTpl!: TemplateRef<any>;

  constructor() {
    this.expenseForm = this.fb.group({
      itemId: ['', Validators.required],
      concept: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      responsible: ['', Validators.required], // Now linked to the dropdown
      description: [''],
    });

    this.extensionForm = this.fb.group({
      itemId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      responsible: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.store.loadBudgetItems();
  }

  openExpense() {
    this.errorMessage = null;
    this.dialog.open(this.expenseTpl, { width: '600px', disableClose: true });
  }

  openExtension() {
    this.dialog.open(this.extensionTpl, { width: '600px', disableClose: true });
  }

  closeForm(form: FormGroup) {
    if (form.dirty) {
      this.dialog
        .open(this.confirmTpl)
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            form.reset();
            this.dialog.closeAll();
          }
        });
    } else {
      this.dialog.closeAll();
    }
  }

  viewDetails(item: BudgetItemEntity) {
    this.store.selectItem(item);
    this.dialog.open(this.detailTpl, { width: '600px' });
  }

  viewExpenses(item: BudgetItemEntity) {
    this.store.selectItem(item);
    this.dialog.open(this.expensesListTpl, { width: '650px' });
  }

  onSaveExpense() {
    if (this.expenseForm.valid) {
      const success = this.store.addExpense(this.expenseForm.value.itemId, this.expenseForm.value);
      if (success) {
        this.dialog.closeAll();
        this.expenseForm.reset();
      } else {
        this.errorMessage = 'budget.errors.insufficient-funds';
      }
    }
  }

  onSaveExtension() {
    if (this.extensionForm.valid) {
      this.store.addExtension(this.extensionForm.value.itemId, this.extensionForm.value.amount);
      this.dialog.closeAll();
      this.extensionForm.reset();
    }
  }

  scrollToItem(id: string) {
    document.getElementById('item-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
