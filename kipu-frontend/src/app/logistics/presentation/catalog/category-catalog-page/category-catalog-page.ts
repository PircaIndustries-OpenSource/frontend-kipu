import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LogisticsStore } from '../../../application/logistics.store';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';
import { CategoryEntity } from '../../../domain/category.entity';

@Component({
  selector: 'app-category-catalog-page',
  imports: [MatIcon, MatRipple, TranslatePipe, MatDialogModule],
  templateUrl: './category-catalog-page.html',
})
export class CategoryCatalogPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  teamUsersStore = inject(TeamUsersStore);
  private dialog = inject(MatDialog);

  readonly categories = this.logisticsStore.categories;

  isLogistica = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Logística' || role === 'Administrador' || role === 'ROLE_ADMIN';
  });

  ngOnInit() {
    this.logisticsStore.loadCategories();
  }

  openCreateDialog() {
    import('./category-catalog-dialog/category-catalog-dialog').then((m) => {
      const ref = this.dialog.open(m.CategoryCatalogDialog, {
        width: '500px',
        disableClose: true,
        data: { mode: 'create' },
      });
      ref.afterClosed().subscribe((result) => {
        if (result) {
          this.logisticsStore.addCategory(result);
        }
      });
    });
  }

  openEditDialog(category: CategoryEntity) {
    import('./category-catalog-dialog/category-catalog-dialog').then((m) => {
      const ref = this.dialog.open(m.CategoryCatalogDialog, {
        width: '500px',
        disableClose: true,
        data: { mode: 'edit', category },
      });
      ref.afterClosed().subscribe((result) => {
        if (result) {
          this.logisticsStore.updateCategory(category.id, result);
        }
      });
    });
  }

  deleteCategory(category: CategoryEntity) {
    import('../../../../shared/presentation/confirm-dialog/confirm-dialog').then((m) => {
      const ref = this.dialog.open(m.ConfirmDialog, {
        width: '420px',
        disableClose: true,
        data: {
          title: 'catalog.category-catalog.delete-title',
          message: 'catalog.category-catalog.delete-message',
          itemName: category.name,
        },
      });
      ref.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.logisticsStore.deleteCategory(category.id);
        }
      });
    });
  }
}
