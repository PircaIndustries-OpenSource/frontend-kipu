import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgressApi } from '../infrastructure/progress.api';
import { ProjectProgress } from '../domain/progress.entity';

@Injectable({
  providedIn: 'root',
})
export class ProgressStore {
  private readonly progressApi = inject(ProgressApi);

  private readonly _progressList = signal<ProjectProgress[]>([]);
  private readonly _loading = signal<boolean>(false);

  readonly progressList = computed(() => this._progressList());
  readonly isLoading = computed(() => this._loading());

  loadProgress(): void {
    this._loading.set(true);

    // --- STATIC MODE (Currently active for UI testing) ---
    const mockData: ProjectProgress[] = [
      {
        id: 1,
        projectId: 101,
        projectName: 'Edificio Los Alisos',
        activityName: 'Vaciado de Losa N3',
        details: 'Nivel 3 - Eje A-F',
        specialty: 'Estructuras',
        status: 'Finished',
        currentPercentage: 100,
        lastUpdate: new Date('2026-04-16'),
      },
      {
        id: 2,
        projectId: 101,
        projectName: 'Edificio Los Alisos',
        activityName: 'Instalación Eléctrica',
        details: 'Nivel 2 - Oficinas',
        specialty: 'Instalaciones',
        status: 'Active',
        currentPercentage: 65,
        lastUpdate: new Date('2026-04-15'),
      },
      {
        id: 3,
        projectId: 102,
        projectName: 'Torre Empresarial',
        activityName: 'Acabado de Muros',
        details: 'Fachada Posterior',
        specialty: 'Arquitectura',
        status: 'Delayed',
        currentPercentage: 30,
        lastUpdate: new Date('2026-04-14'),
      },
    ];

    setTimeout(() => {
      this._progressList.set(mockData);
      this._loading.set(false);
    }, 500);

    // --- API MODE (Uncomment below and remove static block above when json-server is ready) ---
    /*
    this.progressApi.getAllProgress().subscribe({
      next: (data) => {
        this._progressList.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching progress:', err);
        this._loading.set(false);
      }
    });
    */
  }
}
