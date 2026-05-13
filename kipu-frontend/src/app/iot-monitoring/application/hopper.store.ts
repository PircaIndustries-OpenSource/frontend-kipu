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

  loadHopperSensors() {
    this.loadingSignal.set(true);
    this.hopperApiService.getAllHopperSensors().subscribe({
      next: (sensors) => {
        this.hopperSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error fatal en el Store:');
        this.loadingSignal.set(false);
      },
    });
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
}
