import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from '../components/create-project-dialog/create-project-dialog.component';
import { ProjectsStore } from '../../application/projects.store';
import { ChangeProjectStatusDialogComponent } from '../components/change-project-status-dialog/change-project-status-dialog.component';
import { ProjectEntity } from '../../domain/project.entity';

@Component({
    selector: 'app-projects-dashboard',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './projects-dashboard.component.html',
})
export class ProjectsDashboardComponent implements OnInit {
    private dialog = inject(MatDialog);
    private projectsStore = inject(ProjectsStore);

    projects = this.projectsStore.projects;
    isLoading = signal<boolean>(true);

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

    openChangeStatusDialog(project: ProjectEntity) {
        this.dialog.open(ChangeProjectStatusDialogComponent, {
            width: '400px',
            data: { project }
        });
    }
}