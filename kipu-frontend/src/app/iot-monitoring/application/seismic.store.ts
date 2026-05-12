import { inject, Injectable, signal } from '@angular/core';
import { SeismicEntity } from '../domain/seismic.entity';
import { SeismicApiService } from '../infrastructure/services/seismic.api.service';

@Injectable({ providedIn: 'root' })
export class SeismicStore {
  private seismicApiService = inject(SeismicApiService);

  private seismicSensorsSignal = signal<SeismicEntity[]>([]);

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public seismicSensors = this.seismicSensorsSignal.asReadonly();

  loadSeismicSensors() {
    this.loadingSignal.set(true);
    this.seismicApiService.getAllSeismicSensors().subscribe({
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

  deleteSeismicSensor(id: string) {
    this.seismicApiService.deleteSeismicSensor(id).subscribe({
      next: () => {
        this.seismicSensorsSignal.update((sensors) => sensors.filter((s) => s.id !== id));
        console.log(`✅ Registro ${id} eliminado físicamente del JSON y de la pantalla`);
      },
      error: (err) => {
        console.error('❌ El servidor no procesó el borrado. ¿Está encendido json-server?', err);
      },
    });
  }

  addSeismicSensor(newSensor: SeismicEntity) {
    const cleanSensor = new SeismicEntity();

    this.seismicApiService.createSeismicSensor(cleanSensor).subscribe({
      next: (addedSensor) => {
        this.seismicSensorsSignal.update((prev) => [...prev, addedSensor]);
        console.log('✅ Nuevo sensor guardado y añadido a la lista');
      },
      error: (err) => {
        console.error('❌ Error al crear el sensor. Revisa la estructura del JSON', err);
      },
    });
  }
}
