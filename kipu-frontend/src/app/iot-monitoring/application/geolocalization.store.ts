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

  private simulationInterval: any = null;

  loadGeolocalizationPoints() {
    this.loadingSignal.set(true);
    this.iotMonitoringApiService.getAllGeolocalizationPoints().subscribe({
      next: (points) => {
        this.geolocalizationPointsSignal.set(points);
        this.loadingSignal.set(false);
        this.startSimulation();
      },
      error: (err) => {
        this.errorSignal.set('Error al conectar con los puntos');
        this.loadingSignal.set(false);
      },
    });
  }

  private startSimulation() {
    if (this.simulationInterval) return;

    const isInside = (x: number, y: number): boolean => {
      const vs = [
        [20, 30],
        [65, 30],
        [65, 85],
        [20, 70]
      ];
      let inside = false;
      for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    this.simulationInterval = setInterval(() => {
      this.geolocalizationPointsSignal.update((points) =>
        points.map((p) => {
          const newP = new GeolocalizationEntity();
          newP.id = p.id;
          newP.numberId = p.numberId;
          newP.name = p.name;
          newP.projectId = p.projectId;

          const dx = (Math.random() - 0.5) * 3;
          const dy = (Math.random() - 0.5) * 3;
          newP.longitude = Math.max(0, Math.min(100, Number((p.longitude + dx).toFixed(1))));
          newP.latitude = Math.max(0, Math.min(100, Number((p.latitude + dy).toFixed(1))));

          const inside = isInside(newP.longitude, newP.latitude);
          if (inside) {
            newP.state = p.state === 'OUTSIDE OF LIMIT' ? 'OPERATIVE' : p.state;
          } else {
            newP.state = 'OUTSIDE OF LIMIT';
          }

          return newP;
        })
      );
    }, 4500);
  }

  addGeolocalizationPoint(newPoint: GeolocalizationEntity) {
    this.iotMonitoringApiService.createGeolocalizationPoint(newPoint).subscribe({
      next: (addedPoint) => {
        this.geolocalizationPointsSignal.update((prev) => [...prev, addedPoint]);
        console.log('✅ Nueva ubicación guardada y añadida a la lista');
      },
      error: (err) => {
        console.error('❌ Error al crear la ubicación. Revisa la estructura del JSON', err);
      },
    });
  }

  updateGeolocalizationPoint(updatedPoint: GeolocalizationEntity) {
    this.iotMonitoringApiService.updateGeolocalizationPoint(updatedPoint).subscribe({
      next: (savedPoint) => {
        this.geolocalizationPointsSignal.update((points) =>
          points.map((p) => (p.id === savedPoint.id ? savedPoint : p))
        );
        console.log('✅ Ubicación actualizada correctamente');
      },
      error: (err) => {
        console.error('❌ Error al actualizar la ubicación.', err);
      },
    });
  }
}
