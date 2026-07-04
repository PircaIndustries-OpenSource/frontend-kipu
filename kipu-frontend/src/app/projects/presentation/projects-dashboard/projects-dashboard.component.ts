import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { set, get, del } from 'idb-keyval';
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

        // Fetch advances for this project
        const projectAdvances = this.progressStore.allProgress().filter(
            item => String(item.projectId) === String(project.id)
        );

        if (projectAdvances.length === 0) {
            return 0;
        }

        const totalProgress = projectAdvances.reduce((sum, item) => sum + (item.currentPercentage || 0), 0);
        return Math.min(100, Math.round(totalProgress));
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
        const localData = localStorage.getItem('kipu_status_logs');
        let allLogs = [];
        if (localData) {
            try {
                allLogs = JSON.parse(localData);
            } catch(e) {}
        }
        
        const projectLogs = allLogs.filter((l: any) => l.projectId === projectId);
        return projectLogs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    getProjectBlueprints(projectId: string): any[] {
        return this.blueprints().filter((bp: any) => bp.projectId === projectId);
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
                projectId: 'proj-01',
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
                projectId: 'proj-01',
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
                projectId: 'proj-02',
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

    async submitUploadPlan() {
        if (this.uploadPlanData.title && this.uploadPlanData.file) {
            const fileId = 'file-' + Date.now();
            try {
                await set(fileId, this.uploadPlanData.file);
            } catch (e) {
                console.error("Error storing file in IndexedDB", e);
            }
            
            const newPlan = {
                id: 'bp-' + Date.now(),
                projectId: this.currentProject()?.id || '',
                fileId: fileId,
                originalFileName: this.uploadPlanData.file.name,
                fileType: this.uploadPlanData.file.type,
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

    async downloadBlueprint(bp: any) {
        this.snackBar.open('Iniciando descarga...', 'Cerrar', { duration: 3000 });
        try {
            let fileToDownload: Blob;
            let downloadName = bp.title + '.pdf';
            
            if (bp.fileId) {
                const storedFile = await get(bp.fileId);
                if (storedFile) {
                    fileToDownload = storedFile;
                    downloadName = bp.originalFileName || (bp.title + (storedFile.type.includes('pdf') ? '.pdf' : '.jpg'));
                } else {
                    fileToDownload = new Blob(['Documento no encontrado o expiró en caché local.'], { type: 'text/plain' });
                    downloadName = bp.title + '_error.txt';
                }
            } else {
                fileToDownload = new Blob(['Contenido simulado para ' + bp.title], { type: 'text/plain' });
            }
            
            const url = URL.createObjectURL(fileToDownload);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadName;
            link.click();
            URL.revokeObjectURL(url);
        } catch(e) {
            this.snackBar.open('Error al intentar descargar el documento.', 'Cerrar', { duration: 3000 });
        }
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

    async submitDeleteBlueprint() {
        if (this.planToDelete) {
            if (this.planToDelete.fileId) {
                try {
                    await del(this.planToDelete.fileId);
                } catch(e) {
                    console.error("Failed to delete from idb", e);
                }
            }
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