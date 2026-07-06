import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LogisticsStore } from '../../../application/logistics.store';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';
import { MaterialEntity } from '../../../domain/material.entity';

@Component({
  selector: 'app-material-catalog-page',
  imports: [MatIcon, MatRipple, TranslatePipe, MatDialogModule],
  templateUrl: './material-catalog-page.html',
})
export class MaterialCatalogPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  teamUsersStore = inject(TeamUsersStore);
  private dialog = inject(MatDialog);

  readonly materials = this.logisticsStore.materials;
  categories = computed(() => this.logisticsStore.categories());

  isLogistica = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Logística' || role === 'Administrador' || role === 'ROLE_ADMIN';
  });

  ngOnInit() {
    this.logisticsStore.loadMaterials();
    this.logisticsStore.loadCategories();
  }

  openCreateDialog() {
    import('./material-catalog-dialog/material-catalog-dialog').then((m) => {
      const ref = this.dialog.open(m.MaterialCatalogDialog, {
        width: '500px',
        disableClose: true,
        data: { mode: 'create', categories: this.categories() },
      });
      ref.afterClosed().subscribe((result) => {
        if (result) {
          this.logisticsStore.addMaterial(result);
        }
      });
    });
  }

  openEditDialog(material: MaterialEntity) {
    import('./material-catalog-dialog/material-catalog-dialog').then((m) => {
      const ref = this.dialog.open(m.MaterialCatalogDialog, {
        width: '500px',
        disableClose: true,
        data: { mode: 'edit', material, categories: this.categories() },
      });
      ref.afterClosed().subscribe((result) => {
        if (result) {
          this.logisticsStore.updateMaterial(material.id, result);
        }
      });
    });
  }

  deleteMaterial(material: MaterialEntity) {
    import('../../../../shared/presentation/confirm-dialog/confirm-dialog').then((m) => {
      const ref = this.dialog.open(m.ConfirmDialog, {
        width: '420px',
        disableClose: true,
        data: {
          title: 'catalog.material-catalog.delete-title',
          message: 'catalog.material-catalog.delete-message',
          itemName: material.name,
        },
      });
      ref.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.logisticsStore.deleteMaterial(material.id);
        }
      });
    });
  }

  getCategoryName(categoryId: string): string {
    return this.categories().find((c) => c.id === categoryId)?.name || '';
  }
}
