import { Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AddSeismicSensorDialogComponent } from '../../forms/seismic-control/add-seismic-sensor-dialog-component/add-seismic-sensor-dialog-component';
import { SeismicEntity } from '../../../domain/seismic.entity';
import { SeismicStore } from '../../../application/seismic.store';

@Component({
  selector: 'app-seismic-control',
  imports: [MatCard, NgClass, MatIcon, MatButton, FormsModule],
  templateUrl: './seismic-control.html',
  styleUrl: './seismic-control.css',
})
export class SeismicControl implements OnInit {
  //seismicSensors = input.required<SeismicEntity[]>();

  constructor(private dialog: MatDialog) {}

  private store = inject(SeismicStore);

  seismicSensors = this.store.seismicSensors;

  ngOnInit(): void {
    if (this.seismicSensors().length === 0) {
      this.store.loadSeismicSensors();
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddSeismicSensorDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.addSeismicSensor({ ...result, timestamp: new Date().toISOString() });
      }
    });
  }

  onDelete(sensor: SeismicEntity): void {
    if (confirm('Eliminar?')) {
      this.store.deleteSeismicSensor(sensor.id);
    }
  }

  getZones() {
    return this.seismicSensors().length;
  }

  getBlockedZones() {
    let blocked = 0;
    for (let i = 0; i < this.seismicSensors().length; i++) {
      if (this.seismicSensors()[i].state === 'RISK') {
        blocked++;
      }
    }
    return blocked;
  }
}
