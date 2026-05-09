import { computed, inject, Injectable, signal } from '@angular/core';
import { ProjectEntity } from '../domain/project.entity';
import { ProjectsApi } from '../infrastructure/projects.api';

@Injectable({
  providedIn: 'root',
})
export class ProjectsStore {
  projectsApi = inject(ProjectsApi);

  private projectsSignal = signal<ProjectEntity[]>([]);

  readonly projects = computed(() => this.projectsSignal());

  readonly totalProjects = computed(() => this.projects().length);

  loadProjects() {
    if (this.projectsSignal().length === 0) {
      this.projectsApi.getAll().subscribe((data) => {
        this.projectsSignal.set(data);
      });
    }
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
}
