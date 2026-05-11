import { Component, inject, input } from '@angular/core';
import { MachineryEntity } from '../../../domain/machinery.entity';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { LogisticsStore } from '../../../application/logistics.store';
import { MachineryHistoryDialog } from '../machinery-history-dialog/machinery-history-dialog';
import { MachineryAssignDialog } from '../machinery-assign-dialog/machinery-assign-dialog';
import { MachineryMaintenanceDialog } from '../machinery-maintenance-dialog/machinery-maintenance-dialog';

@Component({
  selector: 'app-machinery-item',
  imports: [MatCardModule, MatIconModule, TranslatePipe],
  templateUrl: './machinery-item.html',
  styleUrl: './machinery-item.css',
})
export class MachineryItem {
  item = input.required<MachineryEntity>();
  private dialog = inject(MatDialog);
  private logisticsStore = inject(LogisticsStore);

  get statusKey(): string {
    const s = this.item().status;
    if (s === 'IN_USE') return 'machinery.card.header.status.in-use';
    if (s === 'URGENT_MAINTENANCE') return 'machinery.card.header.status.maintenance';
    return 'machinery.card.header.status.available';
  }

  openHistory() {
    this.dialog.open(MachineryHistoryDialog, {
      width: '500px',
      data: this.item(),
    });
  }

  openAssign() {
    const dialogRef = this.dialog.open(MachineryAssignDialog, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logisticsStore.updateMachinery(this.item().id, {
          assignedTo: result.workerName || result.workerDni,
          status: 'IN_USE',
        });
      }
    });
  }

  registerReturn() {
    this.logisticsStore.updateMachinery(this.item().id, {
      assignedTo: '',
      status: 'AVAILABLE',
    });
  }

  registerMaintenance() {
    const dialogRef = this.dialog.open(MachineryMaintenanceDialog, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logisticsStore.updateMachinery(this.item().id, {
          status: 'URGENT_MAINTENANCE',
          maintenanceHours: result.maintenanceHours,
        });
      }
    });
  }
}
