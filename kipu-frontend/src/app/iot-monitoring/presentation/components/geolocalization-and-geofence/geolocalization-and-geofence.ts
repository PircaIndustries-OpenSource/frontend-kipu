import { Component, input } from '@angular/core';
import { GeolocalizationEntity } from '../../../domain/geolocalization.entity';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-geolocalization-and-geofence',
  imports: [MatButton, MatCard, NgClass, MatIcon],
  templateUrl: './geolocalization-and-geofence.html',
  styleUrl: './geolocalization-and-geofence.css',
})
export class GeolocalizationAndGeofence {
  geolocalizationPoints = input.required<GeolocalizationEntity[]>();
}
