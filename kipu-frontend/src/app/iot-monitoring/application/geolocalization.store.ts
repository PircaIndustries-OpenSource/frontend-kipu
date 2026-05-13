import { inject, Injectable, signal } from '@angular/core';
import { GeolocalizationApiService } from '../infrastructure/services/geolocalization.api.service';
import { GeolocalizationEntity } from '../domain/geolocalization.entity';

@Injectable({ providedIn: 'root' })
export class GeolocalizationStore {
  private iotMonitoringApiService = inject(GeolocalizationApiService);

  private geolocalizationPointsSignal = signal<GeolocalizationEntity[]>([]);
  public geolocalizationPoints = this.geolocalizationPointsSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  loadGeolocalizationPoints() {
    this.loadingSignal.set(true);
    this.iotMonitoringApiService.getAllGeolocalizationPoints().subscribe({
      next: (points) => {
        this.geolocalizationPointsSignal.set(points);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error al conectar con los puntos');
        this.loadingSignal.set(false);
      },
    });
  }
}
