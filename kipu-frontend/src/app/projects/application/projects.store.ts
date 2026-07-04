import { computed, inject, Injectable, signal } from '@angular/core';
import { ProjectEntity } from '../domain/project.entity';
import { ProjectsApi } from '../infrastructure/projects.api';
import { AuthStore } from '../../identity/application/auth.store';
import { TeamUsersApi } from '../../team/team-users/infrastructure/team-users.api';

@Injectable({
  providedIn: 'root',
})
export class ProjectsStore {
  projectsApi = inject(ProjectsApi);
  authStore = inject(AuthStore);
  teamUsersApi = inject(TeamUsersApi);

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
      const email = this.authStore.currentUser()?.email || '';
      this.projectsApi.getAll(email).subscribe((data) => {
        this.projectsSignal.set(data);
      });
    }
  }

  reloadProjects() {
    const email = this.authStore.currentUser()?.email || '';
    this.projectsApi.getAll(email).subscribe((data) => {
      this.projectsSignal.set(data);
    });
  }

  setCurrentProject(id: string) {
    localStorage.setItem('currentProjectId', id);
    this.currentProjectIdSignal.set(id);
  }

  addProject(project: ProjectEntity) {
    const currentUser = this.authStore.currentUser();
    if (!project.createdBy) {
      project.createdBy = currentUser?.email || '';
    }
    this.projectsApi.create(project).subscribe({
      next: (newProject) => {
        this.projectsSignal.update((projects) => [...projects, newProject]);
        if (currentUser) {
          this.teamUsersApi.createTeamUser({
            userId: Number(currentUser.id),
            fullName: currentUser.name || currentUser.email,
            email: currentUser.email,
            role: 'Administrador',
            projectId: newProject.id,
          }).subscribe();
        }
      },
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
      this.pushStatusLog(id, status, justification || '');
    });
  }

  pushStatusLog(projectId: string, status: string, justification: string) {
    const localData = localStorage.getItem('kipu_status_logs');
    let logs = [];
    if (localData) {
        try {
            logs = JSON.parse(localData);
        } catch(e) {}
    }
    const currentUser = this.authStore.currentUser();
    const newLog = {
      projectId,
      date: new Date().toISOString(),
      status,
      justification,
      changedBy: currentUser?.name || currentUser?.email || 'Sistema'
    };
    logs.push(newLog);
    localStorage.setItem('kipu_status_logs', JSON.stringify(logs));
  }

  deleteProject(id: string) {
    this.projectsApi.delete(id).subscribe(() => {
      this.projectsSignal.update((projects) => projects.filter((p) => p.id !== id));
      if (this.currentProjectIdSignal() === id) {
        this.currentProjectIdSignal.set(null);
        localStorage.removeItem('currentProjectId');
      }

      // Cleanup local blueprints and status logs
      const blueprintsData = localStorage.getItem('kipu_blueprints');
      if (blueprintsData) {
        try {
          const blueprints = JSON.parse(blueprintsData);
          const filteredBlueprints = blueprints.filter((bp: any) => bp.projectId !== id);
          localStorage.setItem('kipu_blueprints', JSON.stringify(filteredBlueprints));
        } catch (e) {}
      }

      const logsData = localStorage.getItem('kipu_status_logs');
      if (logsData) {
        try {
          const logs = JSON.parse(logsData);
          const filteredLogs = logs.filter((log: any) => log.projectId !== id);
          localStorage.setItem('kipu_status_logs', JSON.stringify(filteredLogs));
        } catch (e) {}
      }
    });
  }

  clearState() {
    this.projectsSignal.set([]);
    this.currentProjectIdSignal.set(null);
    localStorage.removeItem('currentProjectId');
  }
}
