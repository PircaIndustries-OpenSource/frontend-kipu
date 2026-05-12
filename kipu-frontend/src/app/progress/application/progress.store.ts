import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgressApi } from '../infrastructure/progress.api';
import { ProjectProgress } from '../domain/progress.entity';
import { ProjectsStore } from '../../projects/application/projects.store';

@Injectable({
  providedIn: 'root',
})
export class ProgressStore {
  private readonly progressApi = inject(ProgressApi);
  private readonly projectsStore = inject(ProjectsStore);

  // State signals
  private readonly _progressList = signal<ProjectProgress[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _specialtyFilter = signal<string>('');
  private readonly _searchFilter = signal<string>('');
  private readonly _dateRange = signal<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  /**
   * Reactive selector that filters progress entries by the currently selected project
   * and applies additional user filters (search, specialty, date range).
   */
  readonly progressList = computed(() => {
    const currentProjectId = this.projectsStore.currentProjectId();

    // First, filter by active project context
    let list = this._progressList().filter((item) => item.projectId === currentProjectId);

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
   * Persists a new progress entry to the db.json file and updates the local state.
   */
  addProgress(newEntry: ProjectProgress): void {
    this.progressApi.createProgress(newEntry).subscribe({
      next: (savedEntry) => {
        // Update local signal with the confirmed entry from the server
        this._progressList.update((list) => [savedEntry, ...list]);
      },
      error: (err) => console.error('Failed to save progress to db.json', err),
    });
  }

  /**
   * Fetches the entire progress history from the API.
   * Replaces mock data logic with real database synchronization.
   */
  loadProgress(): void {
    this._loading.set(true);

    this.progressApi.getAllProgress().subscribe({
      next: (data) => {
        this._progressList.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching data from API', err);
        this._loading.set(false);
      },
    });
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
}
