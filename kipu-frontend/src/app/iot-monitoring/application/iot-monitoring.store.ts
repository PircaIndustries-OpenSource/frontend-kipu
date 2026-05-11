import { inject, Injectable, signal } from '@angular/core';
import { IotMonitoringApiService } from '../infrastructure/services/iot-monitoring.api.service';
import { ConcreteEntity } from '../domain/concrete.entity';
import { GeolocalizationEntity } from '../domain/geolocalization.entity';
import { HopperEntity } from '../domain/hopper.entity';
import { SeismicEntity } from '../domain/seismic.entity';

@Injectable({ providedIn: 'root' })
export class IoTMonitoringStore {
  private iotMonitoringApiService = inject(IotMonitoringApiService);
  private concreteSensorsSignal = signal<ConcreteEntity[]>([]);
  private geolocalizationPointsSignal = signal<GeolocalizationEntity[]>([]);
  private hopperSensorsSignal = signal<HopperEntity[]>([]);
  private seismicSensorsSignal = signal<SeismicEntity[]>([]);

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public concreteSensors = this.concreteSensorsSignal.asReadonly();
  public geolocalizationPoints = this.geolocalizationPointsSignal.asReadonly();
  public hopperSensors = this.hopperSensorsSignal.asReadonly();
  public seismicSensors = this.seismicSensorsSignal.asReadonly();
  public isLoading = this.loadingSignal.asReadonly();
  public errorSign = this.errorSignal.asReadonly();

  loadConcreteSensors() {
    this.loadingSignal.set(true); // Empieza a cargar
    this.iotMonitoringApiService.getAllConcreteSensors().subscribe({
      next: (sensors) => {
        this.concreteSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error al conectar con los sensores de curado de concreto.');
        this.loadingSignal.set(false);
      },
    });
  }

  loadSeismicSensors() {
    this.loadingSignal.set(true);
    this.iotMonitoringApiService.getAllSeismicSensors().subscribe({
      next: (sensors) => {
        this.seismicSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error al conectar con los sensores de control sismico.');
        this.loadingSignal.set(false);
      },
    });
  }

  loadHopperSensors() {
    this.loadingSignal.set(true);
    console.log('Intentando cargar tolvas desde la API...'); // <--- LOG 1

    this.iotMonitoringApiService.getAllHopperSensors().subscribe({
      next: (sensors) => {
        console.log('Datos recibidos de la API:', sensors); // <--- LOG 2
        this.hopperSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error fatal en el Store:', err); // <--- LOG 3
        this.loadingSignal.set(false);
      },
    });
  }

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
