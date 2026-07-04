import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MachineryList } from '../machinery-list/machinery-list';
import { LogisticsStore } from '../../../application/logistics.store';
import { TranslatePipe } from '@ngx-translate/core';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MachineryCreateForm } from '../machinery-create-form/machinery-create-form';
import { MachineryCatalogForm } from '../machinery-catalog-form/machinery-catalog-form';
import { MachineryEntity } from '../../../domain/machinery.entity';

@Component({
  selector: 'app-machinery-page',
  imports: [MachineryList, TranslatePipe, SummaryCard, MatIcon, MatRipple, MatDialogModule],
  templateUrl: './machinery-page.html',
  styleUrl: './machinery-page.css',
})
export class MachineryPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  private dialog = inject(MatDialog);

  machinery = this.logisticsStore.machinery;
  filterSignal = signal<string>('all');

  ngOnInit() {
    this.logisticsStore.loadMachinery();
  }

  filteredMachinery = computed(() => {
    const all = this.machinery();
    const filter = this.filterSignal();
    switch (filter) {
      case 'assigned':
        return all.filter((m) => m.assignedTo && m.status === 'IN_USE');
      case 'maintenance':
        return all.filter((m) => m.status === 'URGENT_MAINTENANCE');
      case 'unassigned':
        return all.filter((m) => !m.assignedTo && m.status !== 'URGENT_MAINTENANCE');
      default:
        return all;
    }
  });

  totalCount = computed(() => this.machinery().length);
  inUseCount = computed(() => this.machinery().filter((m) => m.status === 'IN_USE').length);
  maintenanceCount = computed(() => this.machinery().filter((m) => m.status === 'URGENT_MAINTENANCE').length);

  setFilter(filter: string) {
    this.filterSignal.set(filter);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(MachineryCreateForm, {
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const machinery: MachineryEntity = {
          ...new MachineryEntity(),
          ...result,
        };
        this.logisticsStore.addMachinery(machinery);
      }
    });
  }

  openCatalogDialog() {
    const dialogRef = this.dialog.open(MachineryCatalogForm, {
      width: '550px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logisticsStore.addCatalogItem(result, () => {
          this.logisticsStore.loadMachineryCatalog(true);
        });
      }
    });
  }
}
