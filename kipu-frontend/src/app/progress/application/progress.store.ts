import { Injectable, inject, signal, computed, effect } from '@angular/core';
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
  readonly _progressList = signal<ProjectProgress[]>([]);
  readonly allProgress = this._progressList.asReadonly();
  private readonly _loading = signal<boolean>(false);
  private readonly _specialtyFilter = signal<string>('');
  private readonly _searchFilter = signal<string>('');
  private readonly _dateRange = signal<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  constructor() {
    effect(() => {
      const activeId = this.projectsStore.currentProjectId();
      if (activeId) {
        this.loadProgress();
        this.loadPhotos();
      } else {
        this._progressList.set([]);
        this._photosList.set([]);
      }
    });
  }

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

  // Photos
  readonly _photosList = signal<import('../domain/progress-photo.entity').ProgressPhotoEntity[]>([]);
  readonly allPhotos = this._photosList.asReadonly();

  loadPhotos(): void {
    const currentProjectId = this.projectsStore.currentProjectId();
    if (currentProjectId) {
      this.progressApi.getAllPhotos(currentProjectId).subscribe({
        next: (photos) => this._photosList.set(photos),
        error: (err) => console.error('Error fetching photos', err),
      });
    }
  }

  addPhoto(photo: import('../domain/progress-photo.entity').ProgressPhotoEntity): void {
    this.progressApi.createPhoto(photo).subscribe({
      next: (savedPhoto) => this._photosList.update(list => [savedPhoto, ...list]),
      error: (err) => console.error('Error saving photo', err),
    });
  }

  updatePhotoTitle(id: number, title: string): void {
    this.progressApi.updatePhoto(id, title).subscribe({
      next: (updatedPhoto) => this._photosList.update(list => list.map(p => p.id === id ? updatedPhoto : p)),
      error: (err) => console.error('Error updating photo', err),
    });
  }

  deletePhoto(id: number): void {
    this.progressApi.deletePhoto(id).subscribe({
      next: () => this._photosList.update(list => list.filter(p => p.id !== id)),
      error: (err) => console.error('Error deleting photo', err),
    });
  }
}
