import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CreateProjectDialogComponent } from '../components/create-project-dialog/create-project-dialog.component';
import { DeleteProjectDialogComponent } from '../components/delete-project-dialog/delete-project-dialog.component';
import { ProjectsStore } from '../../application/projects.store';
import { ChangeProjectStatusDialogComponent } from '../components/change-project-status-dialog/change-project-status-dialog.component';
import { SelectProjectDialogComponent } from '../components/select-project-dialog/select-project-dialog.component';
import { ProjectEntity } from '../../domain/project.entity';

@Component({
    selector: 'app-projects-dashboard',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
    templateUrl: './projects-dashboard.component.html',
})
export class ProjectsDashboardComponent implements OnInit {
    private dialog = inject(MatDialog);
    private projectsStore = inject(ProjectsStore);

    projects = this.projectsStore.projects;
    currentProjectId = this.projectsStore.currentProjectId;
    isLoading = signal<boolean>(true);
    searchQuery = signal<string>('');

    filteredProjects = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.projects().filter(p => p.name.toLowerCase().includes(query));
    });

    totalActiveProjects = computed(() => {
        return this.projects().filter(p => p.status === 'IN_PROGRESS').length;
    });

    getAdvance(project: ProjectEntity | null): number {
        if (!project) return 0;
        if (project.status === 'COMPLETED') return 100;
        if (project.status === 'IN_PROGRESS') return 45;
        return 10;
    }

    getRNCs(project: ProjectEntity | null): number {
        if (!project) return 0;
        let hash = 0;
        for (let i = 0; i < project.id.length; i++) {
            hash = project.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash + 1) % 9 + 1;
    }

    getCollaborators(project: ProjectEntity | null): number {
        if (!project) return 0;
        let hash = 0;
        for (let i = 0; i < project.id.length; i++) {
            hash = project.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash + 2) % 9 + 1;
    }

    averageAdvance = computed(() => {
        const current = this.projectsStore.currentProject();
        if (current) return this.getAdvance(current) + '%';
        const projs = this.projects();
        if (projs.length === 0) return '0%';
        let sum = 0;
        projs.forEach(p => sum += this.getAdvance(p));
        return Math.round(sum / projs.length) + '%';
    });

    totalRNCs = computed(() => {
        const current = this.projectsStore.currentProject();
        if (current) return this.getRNCs(current);
        return this.projects().reduce((acc, p) => acc + this.getRNCs(p), 0);
    });

    totalCollaborators = computed(() => {
        const current = this.projectsStore.currentProject();
        if (current) return this.getCollaborators(current);
        return this.projects().reduce((acc, p) => acc + this.getCollaborators(p), 0);
    });

    ngOnInit() {
        this.projectsStore.loadProjects();

        setTimeout(() => {
            this.isLoading.set(false);
        }, 1500);
    }

    getDisplayStatus(status: string) {
        const map: Record<string, string> = {
            'PLANNED': 'Planificación',
            'IN_PROGRESS': 'En ejecución',
            'ON_HOLD': 'Pausado',
            'COMPLETED': 'Completado'
        };
        return map[status] || status;
    }

    openCreateDialog() {
        this.dialog.open(CreateProjectDialogComponent, {
            width: '600px',
            disableClose: true
        });
    }

    openChangeStatusDialog(event: Event, project: ProjectEntity) {
        event.stopPropagation();
        this.dialog.open(ChangeProjectStatusDialogComponent, {
            width: '400px',
            data: { project }
        });
    }

    openSelectProjectDialog(project: ProjectEntity) {
        if (this.currentProjectId() === project.id) return;
        this.dialog.open(SelectProjectDialogComponent, {
            width: '400px',
            data: { project }
        });
    }

    openDeleteProjectDialog(event: Event, project: ProjectEntity) {
        event.stopPropagation();
        this.dialog.open(DeleteProjectDialogComponent, {
            width: '400px',
            data: { project }
        });
    }
}