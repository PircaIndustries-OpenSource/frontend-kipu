import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { LogisticsStore } from '../../../application/logistics.store';
import { TeamUsersStore } from '../../../../team/team-users/application/team-users.store';
import { MachineryCatalogEntity } from '../../../domain/machinery.entity';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-machinery-catalog-page',
  imports: [MatIcon, MatRipple, TranslatePipe, MatDialogModule, DatePipe],
  templateUrl: './machinery-catalog-page.html',
})
export class MachineryCatalogPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  teamUsersStore = inject(TeamUsersStore);
  private dialog = inject(MatDialog);

  machineryCatalogs = computed(() => this.logisticsStore.machineryCatalog());

  isLogistica = computed(() => {
    const role = this.teamUsersStore.currentUser()?.role;
    return role === 'Logística' || role === 'Administrador' || role === 'ROLE_ADMIN';
  });

  ngOnInit() {
    this.logisticsStore.loadMachineryCatalog();
  }

  openCreateDialog() {
    import('./machinery-catalog-dialog/machinery-catalog-dialog').then((m) => {
      const ref = this.dialog.open(m.MachineryCatalogDialog, {
        width: '500px',
        disableClose: true,
        data: { mode: 'create' },
      });
      ref.afterClosed().subscribe((result) => {
        if (result) {
          this.logisticsStore.addCatalogItem(result);
        }
      });
    });
  }

  openEditDialog(item: MachineryCatalogEntity) {
    import('./machinery-catalog-dialog/machinery-catalog-dialog').then((m) => {
      const ref = this.dialog.open(m.MachineryCatalogDialog, {
        width: '500px',
        disableClose: true,
        data: { mode: 'edit', item },
      });
      ref.afterClosed().subscribe((result) => {
        if (result) {
          this.logisticsStore.updateCatalogItem(item.id, result);
        }
      });
    });
  }

  deleteCatalogItem(item: MachineryCatalogEntity) {
    import('../../../../shared/presentation/confirm-dialog/confirm-dialog').then((m) => {
      const ref = this.dialog.open(m.ConfirmDialog, {
        width: '420px',
        disableClose: true,
        data: {
          title: 'catalog.machinery-catalog.delete-title',
          message: 'catalog.machinery-catalog.delete-message',
          itemName: item.name,
        },
      });
      ref.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.logisticsStore.deleteCatalogItem(item.id);
        }
      });
    });
  }
}
