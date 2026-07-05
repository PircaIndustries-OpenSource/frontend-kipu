import { Injectable, signal, inject, computed } from '@angular/core';
import { RncEntity } from '../domain/model/rnc.entity';
import { RncApi } from '../infrastructure/rnc.api';
import { ProjectStateService } from '../../shared/application/project-state.service';

/**
 * RncStore
 * Manages the state of RNCs across the application using Signals.
 */
@Injectable({ providedIn: 'root' })
export class RncStore {
  private api = inject(RncApi);
  private projectState = inject(ProjectStateService);

  // Source of truth: all RNCs loaded from API
  private rncsSignal = signal<RncEntity[]>([]);

  // Computed property: filters RNCs by the active project
  readonly rncs = computed(() => {
    const currentId = this.projectState.currentProjectId();
    return this.rncsSignal().filter((rnc) => String(rnc.projectId) === String(currentId));
  });

  readonly loading = signal<boolean>(false);

  /**
   * Fetches all RNCs from the infrastructure layer.
   */
  loadAll(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (data) => {
        this.rncsSignal.set(data); // Update the source signal
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  create(rnc: RncEntity): void {
    this.loading.set(true);
    this.api.create(rnc).subscribe({
      next: (newRnc) => {
        // Update the source signal, computed will automatically reflect the change
        this.rncsSignal.update((list) => [...list, newRnc]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  delete(id: string): void {
    this.api.delete(id).subscribe({
      next: () => {
        // Update the source signal
        this.rncsSignal.update((list) => list.filter((r) => r.id !== id));
      },
      error: (err) => console.error('Error deleting RNC:', err),
    });
  }

  update(rnc: RncEntity): void {
    this.loading.set(true);
    this.api.update(rnc).subscribe({
      next: (updated) => {
        this.rncsSignal.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item)),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
