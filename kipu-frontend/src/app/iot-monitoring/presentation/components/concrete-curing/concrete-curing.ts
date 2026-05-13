import { Component, inject, input, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { ConcreteEntity } from '../../../domain/concrete.entity';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { ConcreteStore } from '../../../application/concrete.store';
import { MatDialog } from '@angular/material/dialog';
import { AddConcreteCuringDialogComponent } from '../../forms/concrete-curing/add-concrete-curing-dialog-component/add-concrete-curing-dialog-component';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-concrete-curing',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatButton,
    NgClass,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './concrete-curing.html',
  styleUrl: './concrete-curing.css',
})
export class ConcreteCuring implements OnInit {
  //concreteSensors = input.required<ConcreteEntity[]>();
  constructor(private dialog: MatDialog) {}

  private store = inject(ConcreteStore);
  //input.required<HopperEntity[]>();
  concreteSensors = this.store.concreteSensors;

  ngOnInit(): void {
    if (this.concreteSensors().length === 0) {
      this.store.loadConcreteSensors();
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddConcreteCuringDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.addConcreteSensor({ ...result });
      }
    });
  }

  onDelete(id: string): void {
    if (confirm('Eliminar?')) {
      this.store.deleteConcreteSensor(id);
    }
  }

  getSensorStatusClass(currentTemp: number, limit: number): string {
    if (currentTemp >= limit) {
      return 'status-danger';
    } else if (currentTemp >= limit - 2) {
      return 'status-warning';
    } else {
      return 'status-ok';
    }
  }

  getOnlineZones() {
    let online = 0;
    for (let i = 0; i < this.concreteSensors().length; i++) {
      if (this.concreteSensors()[i].state === 'ONLINE') {
        online++;
      }
    }
    return online;
  }
}
