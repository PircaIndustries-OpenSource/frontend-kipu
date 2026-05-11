import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LogisticsStore, WasteView } from '../../../application/logistics.store';
import { WasteList } from '../waste-list/waste-list';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { WasteReportForm } from '../waste-report-form/waste-report-form';
import { WasteEntity } from '../../../domain/waste.entity';

@Component({
  selector: 'app-waste-page',
  imports: [WasteList, TranslatePipe, MatIcon, MatRipple, MatDialogModule, MatFormFieldModule, MatDatepickerModule, FormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './waste-page.html',
  styleUrl: './waste-page.css',
})
export class WastePage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  private dialog = inject(MatDialog);

  waste = this.logisticsStore.wasteView;
  dateStart = signal<Date | null>(null);
  dateEnd = signal<Date | null>(null);

  filteredWaste = computed(() => {
    const start = this.dateStart();
    const end = this.dateEnd();
    const all = this.waste();
    if (!start && !end) return all;
    return all.filter((w) => {
      if (!w.date) return false;
      const wasteDate = new Date(w.date);
      if (start && wasteDate < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (wasteDate > endOfDay) return false;
      }
      return true;
    });
  });

  ngOnInit() {
    this.logisticsStore.loadWaste();
    this.logisticsStore.loadInventoryMaterials();
    this.logisticsStore.loadMaterials();
  }

  openReportDialog() {
    const dialogRef = this.dialog.open(WasteReportForm, {
      width: '550px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const waste: WasteEntity = {
          ...new WasteEntity(),
          ...result,
        };
        this.logisticsStore.addWaste(waste);
      }
    });
  }
}
