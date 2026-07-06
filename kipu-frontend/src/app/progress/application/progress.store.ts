import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgressApi } from '../infrastructure/progress.api';
import { ProjectProgress } from '../domain/progress.entity';
import { ProjectsStore } from '../../projects/application/projects.store';
import { forkJoin, of } from 'rxjs'; // Ensure these imports are active at the top of the file

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

  /**
   * Reactive selector that groups mini-advances into their respective parent activities.
   * Isolates Main Advances for the Progress Log while calculating percentages automatically.
   */
  readonly progressList = computed(() => {
    const currentProjectId = this.projectsStore.currentProjectId();
    const allEntries = this._progressList();

    // 1. Context filter by active project
    const projectEntries = allEntries.filter((item) => item.projectId === currentProjectId);

    // 2. Separate Main Activities (Parents) from Daily Reports (Children)
    const parents = projectEntries.filter((item) => !item.isMiniAdvance);
    const children = projectEntries.filter((item) => item.isMiniAdvance);

    // 3. Dynamic math: Calculate parent percentage based on the sum of its children
    let calculatedParents = parents.map((parent) => {
      const subLogs = children.filter((child) => child.parentId === parent.id);

      const totalCalculatedPercentage = subLogs.reduce(
        (sum, child) => sum + (Number(child.currentPercentage) || 0),
        0,
      );

      return {
        ...parent,
        // Caps the max progress at 100% and calculates the state
        currentPercentage: totalCalculatedPercentage > 100 ? 100 : totalCalculatedPercentage,
        status: (totalCalculatedPercentage >= 100 ? 'Finished' : 'Active') as any,
      };
    });

    // 4. Apply your original user criteria filters over the calculated parent list
    const specialty = this._specialtyFilter();
    const searchTerm = this._searchFilter().toLowerCase();
    const { start, end } = this._dateRange();

    if (specialty) {
      calculatedParents = calculatedParents.filter((item) => item.specialty === specialty);
    }
    if (searchTerm) {
      calculatedParents = calculatedParents.filter((item) =>
        item.activityName.toLowerCase().includes(searchTerm),
      );
    }
    if (start && end) {
      calculatedParents = calculatedParents.filter((item) => {
        const itemDate = new Date(item.lastUpdate);
        return itemDate >= start && itemDate <= end;
      });
    }

    return calculatedParents;
  });

  /**
   * Returns all standalone child mini-advances belonging to a specific activity parent ID.
   * Useful to feed the sub-log history table view.
   */
  getChildrenForActivity(parentId: number): ProjectProgress[] {
    const currentProjectId = this.projectsStore.currentProjectId();
    return this._progressList().filter(
      (item) =>
        item.projectId === currentProjectId && item.isMiniAdvance && item.parentId === parentId,
    );
  }

  readonly isLoading = computed(() => this._loading());

  /**
   * Persists a new progress entry (either a parent activity or a child log) to db.json.
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

  updateProgress(id: number, updatedEntry: ProjectProgress): void {
    this.progressApi.updateProgress(id, updatedEntry).subscribe({
      next: (saved) => {
        this._progressList.update((list) => list.map((item) => (item.id === id ? saved : item)));
      },
      error: (err) => console.error('Failed to update progress', err),
    });
  }

  /**
   * Performs an atomic cascade deletion over the persistent server and synchronizes local states.
   */
  removeProgress(id: number): void {
    const targetItem = this._progressList().find(item => Number(item.id) === Number(id));
    const isParent = targetItem ? !targetItem.isMiniAdvance : false;

    // 1. Locate all associated mini-advance children by matching normalized string tokens
    const associatedChildren = this._progressList().filter(
      (item) => item.parentId !== null && Number(item.parentId) === Number(id)
    );

    // 2. Prepare the batch array of HTTP deletion observables for RxJS synchronization
    const deletionTasks = associatedChildren.map((child) => this.progressApi.deleteProgress(child.id));

    // 3. Append the core parent deletion process request to the transactional batch array
    deletionTasks.push(this.progressApi.deleteProgress(id));

    // 4. Force immediate synchronous memory purge on local signals to wipe calendar artifacts from UI views instantly
    this._progressList.update((list) =>
      list.filter((item) => Number(item.id) === Number(id) && (!item.parentId || Number(item.parentId) === Number(id)))
    );

    // 5. Dispatch the synchronized batch requests payload transactionally to prevent json-server file locks
    forkJoin(deletionTasks).subscribe({
      next: () => {
        // Enforce a safe clean state cache reload to synchronize all cross-domain computations
        this.loadProgress();
      },
      error: (err) => {
        console.error('Transactional cascade deletion failed on server architecture layers', err);
        this.loadProgress();
      }
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
