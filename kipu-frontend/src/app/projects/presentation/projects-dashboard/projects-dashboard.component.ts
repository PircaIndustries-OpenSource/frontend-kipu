import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { CreateProjectDialogComponent } from '../components/create-project-dialog/create-project-dialog.component';
import { DeleteProjectDialogComponent } from '../components/delete-project-dialog/delete-project-dialog.component';
import { ProjectsStore } from '../../application/projects.store';
import { ChangeProjectStatusDialogComponent } from '../components/change-project-status-dialog/change-project-status-dialog.component';
import { SelectProjectDialogComponent } from '../components/select-project-dialog/select-project-dialog.component';
import { ProjectEntity } from '../../domain/project.entity';
import { ProgressStore } from '../../../progress/application/progress.store';
import { TeamUsersApi } from '../../../team/team-users/infrastructure/team-users.api';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-projects-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        TranslateModule,
        DialogModule,
        TableModule,
        FormsModule,
        MatMenuModule,
        MatSnackBarModule
    ],
    templateUrl: './projects-dashboard.component.html',
})
export class ProjectsDashboardComponent implements OnInit {
    private dialog = inject(MatDialog);
    private projectsStore = inject(ProjectsStore);
    private progressStore = inject(ProgressStore);
    private teamUsersApi = inject(TeamUsersApi);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    projects = this.projectsStore.projects;
    currentProjectId = this.projectsStore.currentProjectId;
    currentProject = this.projectsStore.currentProject;
    isLoading = signal<boolean>(true);
    searchQuery = signal<string>('');
    projectMembersCount = signal<Record<string, number>>({});
    blueprints = signal<any[]>([]);

    constructor() {
        effect(() => {
            const currentProjs = this.projects();
            if (currentProjs.length > 0) {
                currentProjs.forEach(p => {
                    if (this.projectMembersCount()[p.id] === undefined) {
                        this.teamUsersApi.getTeamUsersByProject(p.id).subscribe({
                            next: (users: any[]) => {
                                this.projectMembersCount.update(counts => ({
                                    ...counts,
                                    [p.id]: users ? users.length : 1
                                }));
                            },
                            error: () => {
                                this.projectMembersCount.update(counts => ({
                                    ...counts,
                                    [p.id]: 1
                                }));
                            }
                        });
                    }
                });
            }
        });
    }

    // Dialog state variables
    displayStatusLogsDialog = false;
    displayBlueprintHistoryDialog = false;
    activeLogs: any[] = [];
    displayUploadPlanDialog = false;
    showUploadForm = false;
    uploadPlanData = { title: '', file: null as File | null };
    selectedBlueprint: any = null;
    displayEditPlanDialog = false;
    displayDeletePlanDialog = false;
    planToEdit: any = null;
    planToDelete: any = null;

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

        // Fetch advances for this project
        const projectAdvances = this.progressStore.allProgress().filter(
            item => String(item.projectId) === String(project.id)
        );

        if (projectAdvances.length === 0) {
            return project.status === 'IN_PROGRESS' ? 45 : 10;
        }

        // Add weights fallback
        const advancesWithWeights = projectAdvances.map(item => ({
            ...item,
            weight: item.weight !== undefined ? item.weight : 1
        }));

        const totalWeight = advancesWithWeights.reduce((sum, item) => sum + (item.weight || 0), 0);
        if (totalWeight === 0) return 0;

        const completedWeight = advancesWithWeights.reduce((sum, item) => {
            return sum + ((item.weight || 0) * (item.currentPercentage || 0) / 100);
        }, 0);

        return Math.round((completedWeight / totalWeight) * 100);
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
        return this.projectMembersCount()[project.id] || 1;
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
        this.projectsStore.reloadProjects();
        this.progressStore.loadProgress();
        this.blueprints.set(this.getInitialBlueprints());

        setTimeout(() => {
            this.isLoading.set(false);
        }, 1500);
    }

    getDisplayStatus(status: string) {
        return 'projects_dashboard.status_' + status.toLowerCase();
    }

    resolveImageUrl(project: ProjectEntity): string {
        if (project.imageUrl) {
            if (project.imageUrl.startsWith('http')) {
                return project.imageUrl;
            }
            return 'assets/' + project.imageUrl;
        }
        const defaultNum = project.id === 'proj-01' ? 1 : project.id === 'proj-02' ? 2 : project.id === 'proj-03' ? 3 : 4;
        return 'assets/project' + defaultNum + '.jpg';
    }

    getProjectStatusLogs(projectId: string): any[] {
        return [
            { date: '2026-05-20T10:00:00.000Z', status: 'IN_PROGRESS', justification: 'Inicio de vaciado de columnas del sótano.', changedBy: 'Paula Montoya' },
            { date: '2026-05-15T14:30:00.000Z', status: 'IN_PROGRESS', justification: 'Planos aprobados y licencia obtenida.', changedBy: 'Carlos Ramos' },
            { date: '2026-05-10T09:00:00.000Z', status: 'PLANNED', justification: 'Presentación de cronograma valorizado.', changedBy: 'Ana Torres' },
            { date: '2026-05-08T11:15:00.000Z', status: 'ON_HOLD', justification: 'Falta de materiales críticos en almacén.', changedBy: 'Juan Pérez' },
            { date: '2026-05-05T08:00:00.000Z', status: 'PLANNED', justification: 'Ajuste de presupuesto de estructuras.', changedBy: 'Paula Montoya' },
            { date: '2026-05-01T16:00:00.000Z', status: 'PLANNED', justification: 'Registro inicial de proyecto.', changedBy: 'Paula Montoya' },
        ];
    }

    getProjectBlueprints(projectId: string): any[] {
        return this.blueprints();
    }

    getInitialBlueprints(): any[] {
        const localData = localStorage.getItem('kipu_blueprints');
        if (localData) {
            try {
                return JSON.parse(localData);
            } catch(e) {}
        }
        return [
            {
                id: 'bp-01',
                title: 'Plano Estructural Cimentación - E-01',
                version: '1.2',
                expirationDate: '2026-12-31T23:59:59.000Z',
                isDigitallySigned: true,
                history: [
                    { version: '1.2', date: '2026-05-10T08:00:00.000Z', changedBy: 'Carlos Ramos', description: 'Corrección de detalle de zapatas aisladas.' },
                    { version: '1.1', date: '2026-04-15T08:00:00.000Z', changedBy: 'Carlos Ramos', description: 'Ajuste inicial de espesor de losa.' },
                    { version: '1.0', date: '2026-03-01T08:00:00.000Z', changedBy: 'Carlos Ramos', description: 'Versión original de diseño.' }
                ]
            },
            {
                id: 'bp-02',
                title: 'Plano de Instalaciones Sanitarias - IS-01',
                version: '1.0',
                expirationDate: '2027-06-30T23:59:59.000Z',
                isDigitallySigned: false,
                history: [
                    { version: '1.0', date: '2026-05-12T08:00:00.000Z', changedBy: 'Luis Gomez', description: 'Distribución básica de agua fría y caliente.' }
                ]
            },
            {
                id: 'bp-03',
                title: 'Especificaciones Técnicas Concreto del Proyecto',
                version: '2.0',
                expirationDate: '2026-11-30T23:59:59.000Z',
                isDigitallySigned: true,
                history: [
                    { version: '2.0', date: '2026-05-05T08:00:00.000Z', changedBy: 'Paula Montoya', description: 'Actualización de aditivos impermeabilizantes.' },
                    { version: '1.0', date: '2026-04-01T08:00:00.000Z', changedBy: 'Paula Montoya', description: 'Especificación original para concreto ciclópeo.' }
                ]
            }
        ];
    }

    uploadPlan() {
        this.showUploadForm = false;
        this.uploadPlanData = { title: '', file: null };
        this.displayUploadPlanDialog = true;
    }

    confirmUploadPlanSignature(requiresSignature: boolean) {
        if (requiresSignature) {
            this.displayUploadPlanDialog = false;
            this.router.navigate(['/signatures'], { queryParams: { action: 'create' } });
        } else {
            this.showUploadForm = true;
        }
    }

    onUploadPlanFileChange(event: any) {
        const file = event.target.files[0];
        this.uploadPlanData.file = file;
    }

    submitUploadPlan() {
        if (this.uploadPlanData.title && this.uploadPlanData.file) {
            const newPlan = {
                id: 'bp-' + Date.now(),
                title: this.uploadPlanData.title,
                version: '1.0',
                expirationDate: new Date().toISOString(), // Changed to reflect "added date" rather than expiration
                isDigitallySigned: false,
                requireSignature: false,
                history: [
                    { version: '1.0', date: new Date().toISOString(), changedBy: 'Tú', description: 'Subida inicial.' }
                ]
            };
            this.blueprints.update(bps => {
                const updated = [...bps, newPlan];
                localStorage.setItem('kipu_blueprints', JSON.stringify(updated));
                return updated;
            });
            this.displayUploadPlanDialog = false;
            this.snackBar.open('El plano ha sido almacenado correctamente.', 'Cerrar', { duration: 3000 });
        }
    }

    downloadBlueprint(bp: any) {
        // Obtenemos la traducción dinámica del snackbar
        const el = document.createElement('div');
        this.snackBar.open('Iniciando descarga...', 'Cerrar', { duration: 3000 });
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,Contenido simulado para ' + encodeURIComponent(bp.title);
            link.download = bp.title + '.pdf';
            link.click();
        }, 1000);
    }

    openEditBlueprint(bp: any) {
        this.planToEdit = { ...bp };
        this.displayEditPlanDialog = true;
    }

    submitEditBlueprint() {
        if (this.planToEdit) {
            this.blueprints.update(bps => {
                const updated = bps.map(b => b.id === this.planToEdit.id ? this.planToEdit : b);
                localStorage.setItem('kipu_blueprints', JSON.stringify(updated));
                return updated;
            });
            this.displayEditPlanDialog = false;
            this.snackBar.open('Documento actualizado correctamente.', 'Cerrar', { duration: 3000 });
        }
    }

    openDeleteBlueprint(bp: any) {
        this.planToDelete = bp;
        this.displayDeletePlanDialog = true;
    }

    submitDeleteBlueprint() {
        if (this.planToDelete) {
            this.blueprints.update(bps => {
                const updated = bps.filter(b => b.id !== this.planToDelete.id);
                localStorage.setItem('kipu_blueprints', JSON.stringify(updated));
                return updated;
            });
            this.displayDeletePlanDialog = false;
            this.snackBar.open('Documento eliminado.', 'Cerrar', { duration: 3000 });
        }
    }

    showAllStatusLogs(project: ProjectEntity) {
        this.activeLogs = this.getProjectStatusLogs(project.id);
        this.displayStatusLogsDialog = true;
    }

    showBlueprintHistory(blueprint: any) {
        this.selectedBlueprint = blueprint;
        this.displayBlueprintHistoryDialog = true;
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