import { Component, inject, input } from '@angular/core';
import { GeolocalizationEntity } from '../../../domain/geolocalization.entity';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { GeolocalizationStore } from '../../../application/geolocalization.store';

@Component({
  selector: 'app-geolocalization-and-geofence',
  imports: [MatButton, MatCard, NgClass, MatIcon],
  templateUrl: './geolocalization-and-geofence.html',
  styleUrl: './geolocalization-and-geofence.css',
})
export class GeolocalizationAndGeofence {
  //readonly geolocalizationPoints = input.required<GeolocalizationEntity[]>();

  private store = inject(GeolocalizationStore);

  geolocalizationPoints = this.store.geolocalizationPoints;

  ngOnInit(): void {
    if (this.geolocalizationPoints().length === 0) {
      this.store.loadGeolocalizationPoints();
    }
  }
}
