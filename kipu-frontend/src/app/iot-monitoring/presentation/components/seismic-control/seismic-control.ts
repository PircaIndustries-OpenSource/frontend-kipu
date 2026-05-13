import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  filterState = signal<'ALL' | 'RISK'>('ALL');

  filteredSeismicSensors = computed(() => {
    const sensors = this.seismicSensors();
    const filter = this.filterState();

    if (filter === 'ALL') return sensors;

    return sensors.filter((sensor) => sensor.state === 'RISK');
  });

  ngOnInit(): void {
    if (this.seismicSensors().length === 0) {
      this.store.loadSeismicSensors();
    }
  }

  setFilter(mode: 'ALL' | 'RISK'): void {
    this.filterState.set(mode);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddSeismicSensorDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Resultado del diálogo:', result); // Revisa esto en la consola (F12)
      if (result) {
        this.store.addSeismicSensor(result);
      }
    });
  }

  onDelete(sensor: SeismicEntity): void {
    if (confirm('Eliminar?')) {
      this.store.eraseSeismicSensor(sensor.id);
    }
  }

  getZones() {
    return this.seismicSensors().length;
  }

  getBlockedZones() {
    return this.seismicSensors().filter((sensor) => sensor.state === 'RISK').length;
  }
}
