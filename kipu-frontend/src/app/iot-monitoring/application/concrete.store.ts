import { inject, Injectable, signal } from '@angular/core';
import { ConcreteEntity } from '../domain/concrete.entity';
import { ConcreteApiService } from '../infrastructure/services/concrete.api.service';

@Injectable({ providedIn: 'root' })
export class ConcreteStore {
  private concreteApiService = inject(ConcreteApiService);

  private concreteSensorsSignal = signal<ConcreteEntity[]>([]);
  public concreteSensors = this.concreteSensorsSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  loadConcreteSensors() {
    this.loadingSignal.set(true);
    this.concreteApiService.getAllConcreteSensors().subscribe({
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

  deleteConcreteSensor(id: string) {
    console.log(`${id}`);
    this.concreteApiService.deleteConcreteSensor(id).subscribe({
      next: () => {
        this.concreteSensorsSignal.update((sensors) => sensors.filter((s) => s.id !== id));
        console.log(`✅ Registro ${id} eliminado físicamente del JSON y de la pantalla`);
      },
      error: (err) => {
        console.error('❌ El servidor no procesó el borrado. ¿Está encendido json-server?', err);
      },
    });
  }

  updateConcreteSensor(updatedSensor: ConcreteEntity) {
    this.concreteApiService.updateConcreteSensor(updatedSensor).subscribe({
      next: (savedSensor) => {
        this.concreteSensorsSignal.update((sensors) =>
          sensors.map((s) => (s.id === savedSensor.id ? savedSensor : s))
        );
        console.log('✅ Sensor actualizado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al actualizar el sensor. Revisa json-server.', err);
      },
    });
  }

  addConcreteSensor(newSensor: ConcreteEntity) {
    this.concreteApiService.createConcreteSensor(newSensor).subscribe({
      next: (addedSensor) => {
        this.concreteSensorsSignal.update((prev) => [...prev, addedSensor]);
        console.log('✅ Nuevo sensor guardado y añadido a la lista');
      },
      error: (err) => {
        console.error('❌ Error al crear el sensor. Revisa la estructura del JSON', err);
      },
    });
  }
}
