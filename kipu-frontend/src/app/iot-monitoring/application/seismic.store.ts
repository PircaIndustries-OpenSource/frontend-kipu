import { inject, Injectable, signal } from '@angular/core';
import { SeismicEntity } from '../domain/seismic.entity';
import { SeismicApiService } from '../infrastructure/services/seismic.api.service';

@Injectable({ providedIn: 'root' })
export class SeismicStore {
  private seismicApiService = inject(SeismicApiService);

  private seismicSensorsSignal = signal<SeismicEntity[]>([]);
  public seismicSensors = this.seismicSensorsSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  private simulationInterval: any = null;

  loadSeismicSensors() {
    this.loadingSignal.set(true);
    this.seismicApiService.getAllSeismicSensors().subscribe({
      next: (sensors) => {
        this.seismicSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
        this.startSimulation();
      },
      error: (err) => {
        this.errorSignal.set('Error al conectar con los sensores de control sismico.');
        this.loadingSignal.set(false);
      },
    });
  }

  private startSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      this.seismicSensorsSignal.update((sensors) =>
        sensors.map((s) => {
          // Sensores bloqueados no varían hasta que el operario los desbloquee
          if (s.state === 'RISK') return s;

          const newS = new SeismicEntity();
          newS.id = s.id;
          newS.projectId = s.projectId;
          newS.sensorId = s.sensorId;
          newS.name = s.name;
          newS.unit = s.unit;
          newS.limit = s.limit;
          newS.location = s.location;

          // Variación aleatoria: ±0 a 0.8 unidades por tick
          const delta = (Math.random() - 0.5) * 0.8;
          let newVal = Number((s.lastLecture + delta).toFixed(1));

          // No puede bajar de 0
          if (newVal < 0) newVal = 0;

          // Estado derivado de la lectura
          newS.state = newVal >= s.limit ? 'RISK' : 'NORMAL';
          newS.lastLecture = newVal;
          newS.timeLecture = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return newS;
        })
      );
    }, 5000);
  }

  eraseSeismicSensor(id: string) {
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
    this.seismicApiService.createSeismicSensor(newSensor).subscribe({
      next: (addedSensor) => {
        this.seismicSensorsSignal.update((prev) => [...prev, addedSensor]);
        console.log('✅ Nuevo sensor guardado y añadido a la lista');
      },
      error: (err) => {
        console.error('❌ Error al crear el sensor. Revisa la estructura del JSON', err);
      },
    });
  }

  updateSeismicSensor(updatedSensor: SeismicEntity) {
    this.seismicApiService.updateSeismicSensor(updatedSensor).subscribe({
      next: (savedSensor) => {
        this.seismicSensorsSignal.update((sensors) =>
          sensors.map((s) => (s.id === savedSensor.id ? savedSensor : s))
        );
        console.log('✅ Sensor actualizado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al actualizar el sensor.', err);
      },
    });
  }
}
