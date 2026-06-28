import { Component, inject, OnInit } from '@angular/core';
import { GeolocalizationEntity } from '../../../domain/geolocalization.entity';
import { MatCard } from '@angular/material/card';
import { NgClass, DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { GeolocalizationStore } from '../../../application/geolocalization.store';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddGeolocalizationDialogComponent } from '../../forms/geolocalization/add-geolocalization-dialog-component/add-geolocalization-dialog-component';
import { EditGeolocalizationDialogComponent } from '../../forms/geolocalization/edit-geolocalization-dialog-component/edit-geolocalization-dialog-component';

@Component({
  selector: 'app-geolocalization-and-geofence',
  imports: [MatCard, NgClass, MatIcon, TranslatePipe, DecimalPipe, MatButton],
  templateUrl: './geolocalization-and-geofence.html',
  styleUrl: './geolocalization-and-geofence.css',
})
export class GeolocalizationAndGeofence implements OnInit {
  private store = inject(GeolocalizationStore);
  private dialog = inject(MatDialog);

  geolocalizationPoints = this.store.geolocalizationPoints;
  zoomLevel = 1;

  zoomIn(): void {
    if (this.zoomLevel < 3) this.zoomLevel += 0.5;
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) this.zoomLevel -= 0.5;
  }

  ngOnInit(): void {
    if (this.geolocalizationPoints().length === 0) {
      this.store.loadGeolocalizationPoints();
    }
  }

  getInsideCount(): number {
    return this.geolocalizationPoints().filter(
      (p) => p.state !== 'OUTSIDE OF LIMIT'
    ).length;
  }

  getOutsideCount(): number {
    return this.geolocalizationPoints().filter(
      (p) => p.state === 'OUTSIDE OF LIMIT'
    ).length;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddGeolocalizationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Resultado del diálogo de geolocalización:', result);
      if (result) {
        this.store.addGeolocalizationPoint(result);
      }
    });
  }

  openEditDialog(equip: GeolocalizationEntity): void {
    const dialogRef = this.dialog.open(EditGeolocalizationDialogComponent, {
      data: equip,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Resultado del diálogo de edición de geolocalización:', result);
      if (result) {
        this.store.updateGeolocalizationPoint(result);
      }
    });
  }
}
