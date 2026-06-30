import { inject, Injectable, signal, effect } from '@angular/core';
import { ConcreteEntity } from '../domain/concrete.entity';
import { ConcreteApiService } from '../infrastructure/services/concrete.api.service';
import { ProjectsStore } from '../../projects/application/projects.store';

@Injectable({ providedIn: 'root' })
export class ConcreteStore {
  private concreteApiService = inject(ConcreteApiService);

  private concreteSensorsSignal = signal<ConcreteEntity[]>([]);
  public concreteSensors = this.concreteSensorsSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  private simulationInterval: any = null;
  private projectsStore = inject(ProjectsStore);

  constructor() {
    effect(() => {
      const activeId = this.projectsStore.currentProjectId();
      if (activeId) {
        this.loadConcreteSensors();
      } else {
        this.concreteSensorsSignal.set([]);
      }
    });
  }

  loadConcreteSensors() {
    this.loadingSignal.set(true);
    this.concreteApiService.getAllConcreteSensors().subscribe({
      next: (sensors) => {
        this.concreteSensorsSignal.set(sensors);
        this.loadingSignal.set(false);
        this.startSimulation();
      },
      error: (err) => {
        this.errorSignal.set('Error al conectar con los sensores de curado de concreto.');
        this.loadingSignal.set(false);
      },
    });
  }

  private startSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = setInterval(() => {
      this.concreteSensorsSignal.update((sensors) =>
        sensors.map((s) => {
          const newS = new ConcreteEntity();
          newS.id = s.id;
          newS.projectId = s.projectId;
          newS.sensorId = s.sensorId;
          newS.location = s.location;
          newS.unit = s.unit;
          newS.limit = s.limit;
          newS.state = s.state;

          const tempDelta = (Math.random() - 0.5) * 0.6;
          newS.temperature = Math.max(10, Math.min(45, Number((s.temperature + tempDelta).toFixed(1))));

          const humDelta = (Math.random() - 0.5) * 1.0;
          newS.humidity = Math.max(20, Math.min(95, Math.round(s.humidity + humDelta)));

          return newS;
        })
      );
    }, 4000);
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
