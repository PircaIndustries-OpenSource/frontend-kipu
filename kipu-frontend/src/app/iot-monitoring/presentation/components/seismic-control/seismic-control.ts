import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCard, MatCardHeader, MatCardContent, MatCardFooter } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AddSeismicSensorDialogComponent } from '../../forms/seismic-control/add-seismic-sensor-dialog-component/add-seismic-sensor-dialog-component';
import { EditSeismicSensorDialogComponent } from '../../forms/seismic-control/edit-seismic-sensor-dialog-component/edit-seismic-sensor-dialog-component';
import { SeismicEntity } from '../../../domain/seismic.entity';
import { SeismicStore } from '../../../application/seismic.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-seismic-control',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    NgClass,
    MatIcon,
    MatButton,
    FormsModule,
    TranslatePipe,
  ],
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

  openConfigureDialog(sensor: SeismicEntity) {
    const dialogRef = this.dialog.open(EditSeismicSensorDialogComponent, {
      data: sensor,
    });

    dialogRef.afterClosed().subscribe((result: SeismicEntity) => {
      if (result) {
        this.store.updateSeismicSensor(result);
      }
    });
  }

  onDelete(sensor: SeismicEntity): void {
    if (confirm('Eliminar?')) {
      this.store.eraseSeismicSensor(sensor.id);
    }
  }

  unlockSensor(sensor: SeismicEntity, authCode: string) {
    if (authCode === '1234' || authCode.toLowerCase() === 'admin') {
      const updatedSensor = new SeismicEntity();
      updatedSensor.id = sensor.id;
      updatedSensor.projectId = sensor.projectId;
      updatedSensor.sensorId = sensor.sensorId;
      updatedSensor.name = sensor.name;
      updatedSensor.unit = sensor.unit;
      updatedSensor.location = sensor.location;
      
      // Set to a logically safe value below limit
      const safeLecture = Number((sensor.limit - 1 - Math.random() * 0.5).toFixed(1));
      updatedSensor.lastLecture = safeLecture < 0.1 ? 0.5 : safeLecture;
      
      updatedSensor.limit = sensor.limit;
      updatedSensor.timeLecture = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      updatedSensor.state = 'NORMAL';
      this.store.updateSeismicSensor(updatedSensor);
    } else {
      alert('Contraseña de autorización incorrecta.');
    }
  }

  getZones() {
    return this.seismicSensors().length;
  }

  getBlockedZones() {
    return this.seismicSensors().filter((sensor) => sensor.state === 'RISK').length;
  }
}
