import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgressApi } from '../infrastructure/progress.api';
import { ProjectProgress } from '../domain/progress.entity';

@Injectable({
  providedIn: 'root',
})
export class ProgressStore {
  private readonly progressApi = inject(ProgressApi);

  // State signals
  private readonly _progressList = signal<ProjectProgress[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _specialtyFilter = signal<string>('');
  private readonly _searchFilter = signal<string>('');
  private readonly _dateRange = signal<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  // Selectors
  readonly progressList = computed(() => {
    let list = this._progressList();
    const specialty = this._specialtyFilter();
    const searchTerm = this._searchFilter().toLowerCase();
    const { start, end } = this._dateRange();

    if (specialty) list = list.filter((item) => item.specialty === specialty);
    if (searchTerm)
      list = list.filter((item) => item.activityName.toLowerCase().includes(searchTerm));
    if (start && end) {
      list = list.filter((item) => {
        const itemDate = new Date(item.lastUpdate);
        return itemDate >= start && itemDate <= end;
      });
    }
    return list;
  });

  readonly isLoading = computed(() => this._loading());

  /**
   * Adds new entry to the signal for immediate UI update.
   */
  addProgress(newEntry: ProjectProgress): void {
    this._progressList.update((list) => [newEntry, ...list]);
  }

  setSpecialtyFilter(v: string): void {
    this._specialtyFilter.set(v);
  }
  setSearchFilter(v: string): void {
    this._searchFilter.set(v);
  }
  setDateRange(start: Date | null, end: Date | null): void {
    this._dateRange.set({ start, end });
  }

  /**
   * Loads initial data with API structure preserved.
   */
  loadProgress(): void {
    this._loading.set(true);
    const mockData: ProjectProgress[] = [
      {
        id: 1,
        projectId: 101,
        projectName: 'Torre Empresarial Centro',
        activityName: 'Vaciado de Losa N3',
        details: 'Nivel 3 - Eje A-F',
        specialty: 'Estructuras',
        status: 'Finished',
        currentPercentage: 100,
        startDate: new Date(),
        endDate: new Date(),
        lastUpdate: new Date('2026-04-15'),
      },
      {
        id: 2,
        projectId: 101,
        projectName: 'Torre Empresarial Centro',
        activityName: 'Instalación Eléctrica',
        details: 'Nivel 2 - Oficinas',
        specialty: 'Instalaciones',
        status: 'Active',
        currentPercentage: 65,
        startDate: new Date(),
        endDate: new Date(),
        lastUpdate: new Date('2026-04-14'),
      },
      {
        id: 3,
        projectId: 101,
        projectName: 'Torre Empresarial Centro',
        activityName: 'Acabado de Muros',
        details: 'Fachada Posterior',
        specialty: 'Arquitectura',
        status: 'Delayed',
        currentPercentage: 30,
        startDate: new Date(),
        endDate: new Date(),
        lastUpdate: new Date('2026-04-13'),
      },
    ];

    setTimeout(() => {
      this._progressList.set(mockData);
      this._loading.set(false);
    }, 500);

    /* // API CONNECTION READY FOR DB.JSON
    this.progressApi.getAllProgress().subscribe({
      next: (data) => { this._progressList.set(data); this._loading.set(false); },
      error: () => this._loading.set(false)
    });
    */
  }
}
