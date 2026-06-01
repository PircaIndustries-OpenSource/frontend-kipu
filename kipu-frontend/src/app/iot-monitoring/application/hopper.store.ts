import { inject, Injectable, signal } from '@angular/core';
import { HopperEntity } from '../domain/hopper.entity';
import { HopperApiService } from '../infrastructure/services/hopper.api.services';

@Injectable({ providedIn: 'root' })
export class HopperStore {
  private hopperApiService = inject(HopperApiService);

  private hopperSensorsSignal = signal<HopperEntity[]>([]);
  public hopperSensors = this.hopperSensorsSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  private simulationInterval: any = null;

  loadHopperSensors() {
    this.loadingSignal.set(true);
    this.hopperApiService.getAllHopperSensors().subscribe({
      next: (sensors) => {
        this.hopperSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
        this.startSimulation();
      },
      error: (err) => {
        this.errorSignal.set('Error fatal en el Store:');
        this.loadingSignal.set(false);
      },
    });
  }

  private startSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      this.hopperSensorsSignal.update((sensors) =>
        sensors.map((s) => {
          const newS = new HopperEntity();
          newS.id = s.id;
          newS.projectId = s.projectId;
          newS.sensorId = s.sensorId;
          newS.name = s.name;
          newS.unit = s.unit;
          newS.limit = s.limit;
          newS.state = s.state;

          let newL = s.lastLecture - Math.floor(Math.random() * 3 + 1);
          if (newL < 5) {
            newL = 85 + Math.floor(Math.random() * 15);
            newS.state = 'OPTIMUM';
            console.log(`🚚 Tolva ${s.name} rellenada automáticamente`);
          } else {
            newS.state = newL < s.limit ? 'CRITIC' : 'OPTIMUM';
          }
          newS.lastLecture = newL;

          return newS;
        })
      );
    }, 6000);
  }

  eraseHopperSensor(id: string) {
    this.hopperApiService.deleteHopperSensor(id).subscribe({
      next: () => {
        this.hopperSensorsSignal.update((sensors) => sensors.filter((s) => s.id !== id));
        console.log(`✅ Registro ${id} eliminado físicamente del JSON y de la pantalla`);
      },
      error: (err) => {
        console.error('❌ El servidor no procesó el borrado. ¿Está encendido json-server?', err);
      },
    });
  }

  addHopperSensor(newSensor: HopperEntity) {
    this.hopperApiService.createHopperSensor(newSensor).subscribe({
      next: (addedSensor) => {
        this.hopperSensorsSignal.update((prev) => [...prev, addedSensor]);
        console.log('✅ Nuevo sensor guardado y añadido a la lista');
      },
      error: (err) => {
        console.error('❌ Error al crear el sensor. Revisa la estructura del JSON', err);
      },
    });
  }

  updateHopperSensor(updatedSensor: HopperEntity) {
    this.hopperApiService.updateHopperSensor(updatedSensor).subscribe({
      next: (savedSensor) => {
        this.hopperSensorsSignal.update((sensors) =>
          sensors.map((s) => (s.id === savedSensor.id ? savedSensor : s))
        );
        console.log('✅ Sensor de tolva actualizado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al actualizar el sensor de tolva.', err);
      },
    });
  }
}
