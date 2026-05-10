import { Component, input } from '@angular/core';
import { SeismicEntity } from '../../../domain/seismic.entity';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-seismic-control',
  imports: [MatCard, NgClass, MatIcon, MatButton],
  templateUrl: './seismic-control.html',
  styleUrl: './seismic-control.css',
})
export class SeismicControl {
  seismicSensors = input.required<SeismicEntity[]>();

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
