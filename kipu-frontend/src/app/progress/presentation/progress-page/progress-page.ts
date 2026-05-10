import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ProjectProgress } from '../../domain/progress.entity';
import { ProgressApi } from '../../infrastructure/progress.api';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  // Removed MatCheckboxModule to match the new progress tracking design
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './progress-page.html'
})
export class ProgressPage implements OnInit {
  // Infrastructure API service
  private readonly progressApi = inject(ProgressApi);

  // Signal to manage the list of progress entries
  projects = signal<ProjectProgress[]>([]);

  ngOnInit(): void {
    /** * STATIC MODE (Hardcoded data)
     * This is used to test the UI design and progress bars without the API.
     */
    this.projects.set([
      {
        id: 1,
        projectId: 101,
        projectName: 'Edificio Corporativo Los Olivos',
        location: 'Lima, Perú',
        status: 'Active',
        imageUrl: '',
        currentPercentage: 75,
        lastUpdate: new Date('2026-01-10T10:00:00Z')
      },
      {
        id: 2,
        projectId: 102,
        projectName: 'Residencial San Miguel',
        location: 'Lima, Perú',
        status: 'Progress',
        imageUrl: '',
        currentPercentage: 40,
        lastUpdate: new Date('2026-07-01T15:30:00Z')
      },
      {
        id: 3,
        projectId: 103,
        projectName: 'Colegio Particular San José',
        location: 'Cusco, Perú',
        status: 'Finished',
        imageUrl: '',
        currentPercentage: 100,
        lastUpdate: new Date('2025-03-01T08:00:00Z')
      }
    ]);

    /**
     * DYNAMIC MODE (API Connection)
     * UNCOMMENT the line below to fetch data dynamically from the json-server.
     */
    // this.loadProgressFromApi();
  }

  /**
   * Fetches data from the Fake API and updates the signal
   * Fully commented to avoid runtime errors until API is completely ready.
   */
  /*
  private loadProgressFromApi(): void {
    this.progressApi.getAllProgress().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Error fetching progress from API:', err)
    });
  }
  */

  /**
   * Returns Tailwind CSS classes for status badges based on design reference
   */
  getStatusBadgeClass(status: string): string {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'Active': return `${base} bg-green-100 text-green-800`;
      case 'Progress': return `${base} bg-blue-100 text-blue-800`;
      case 'Finished': return `${base} bg-gray-100 text-gray-800`;
      default: return `${base} bg-gray-100 text-gray-600`;
    }
  }

  /**
   * Maps domain status to i18n translation keys
   */
  getStatusKey(status: string): string {
    switch (status) {
      case 'Active': return 'progress.status.active';
      case 'Progress': return 'progress.status.planned';
      case 'Finished': return 'progress.status.completed';
      default: return 'progress.status.unknown';
    }
  }
}
