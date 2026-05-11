import { computed, inject, Injectable, signal } from '@angular/core';
import { ProjectEntity } from '../domain/project.entity';
import { ProjectsApi } from '../infrastructure/projects.api';

@Injectable({
  providedIn: 'root',
})
export class ProjectsStore {
  projectsApi = inject(ProjectsApi);

  private projectsSignal = signal<ProjectEntity[]>([]);
  private currentProjectIdSignal = signal<string | null>(localStorage.getItem('currentProjectId') || null);

  readonly projects = computed(() => this.projectsSignal());
  readonly currentProjectId = computed(() => this.currentProjectIdSignal());
  readonly currentProject = computed(() => 
    this.projectsSignal().find(p => p.id === this.currentProjectIdSignal()) || null
  );

  readonly totalProjects = computed(() => this.projects().length);

  loadProjects() {
    if (this.projectsSignal().length === 0) {
      this.projectsApi.getAll().subscribe((data) => {
        this.projectsSignal.set(data);
      });
    }
  }

  setCurrentProject(id: string) {
    localStorage.setItem('currentProjectId', id);
    this.currentProjectIdSignal.set(id);
  }

  addProject(project: ProjectEntity) {
    this.projectsApi.create(project).subscribe((newProject) => {
      this.projectsSignal.update((projects) => [...projects, newProject]);
    });
  }

  checkNameExists(name: string) {
    return this.projectsApi.checkNameExists(name);
  }

  updateProjectStatus(id: string, status: string, justification?: string) {
    return this.projectsApi.updateStatus(id, { status, statusJustification: justification }).subscribe((updatedProject) => {
      this.projectsSignal.update((projects) =>
        projects.map((p) => (p.id === id ? updatedProject : p))
      );
    });
  }

  deleteProject(id: string) {
    this.projectsApi.delete(id).subscribe(() => {
      this.projectsSignal.update((projects) => projects.filter((p) => p.id !== id));
      if (this.currentProjectIdSignal() === id) {
        this.currentProjectIdSignal.set(null);
        localStorage.removeItem('currentProjectId');
      }
    });
  }
}
