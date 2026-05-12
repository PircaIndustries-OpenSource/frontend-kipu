import { inject, Injectable, signal } from '@angular/core';
import { ConcreteEntity } from '../domain/concrete.entity';
import { ConcreteApiService } from '../infrastructure/services/concrete.api.service';
import { SeismicEntity } from '../domain/seismic.entity';

@Injectable({ providedIn: 'root' })
export class ConcreteStore {
  private concreteApiService = inject(ConcreteApiService);

  private concreteSensorsSignal = signal<ConcreteEntity[]>([]);

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  public concreteSensors = this.concreteSensorsSignal.asReadonly();

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

  addConcreteSensor(newSensor: ConcreteEntity) {
    const cleanSensor = new ConcreteEntity();

    this.concreteApiService.createConcreteSensor(cleanSensor).subscribe({
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
