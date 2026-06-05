import { Injectable, inject, computed } from '@angular/core';
import { ProjectsStore } from '../../projects/application/projects.store';

@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  private projectsStore = inject(ProjectsStore);

  // Expose active project ID and details
  currentProjectId = this.projectsStore.currentProjectId;
  projects = this.projectsStore.projects;
  currentProject = this.projectsStore.currentProject;

  // Active project name
  currentProjectName = computed(() => this.projectsStore.currentProject()?.name || '');

  // Method to set active project
  setCurrentProject(id: string) {
    this.projectsStore.setCurrentProject(id);
  }
}
