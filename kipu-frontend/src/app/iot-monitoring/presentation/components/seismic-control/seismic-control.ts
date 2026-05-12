import { Component, inject, input, OnInit } from '@angular/core';
import { SeismicEntity } from '../../../domain/seismic.entity';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { IoTMonitoringStore } from '../../../application/iot-monitoring.store';

@Component({
  selector: 'app-seismic-control',
  imports: [MatCard, NgClass, MatIcon, MatButton],
  templateUrl: './seismic-control.html',
  styleUrl: './seismic-control.css',
})
export class SeismicControl implements OnInit {
  //seismicSensors = input.required<SeismicEntity[]>();

  private store = inject(IoTMonitoringStore);

  seismicSensors = this.store.seismicSensors;

  ngOnInit(): void {
    if (this.seismicSensors().length === 0) {
      this.store.loadSeismicSensors();
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
