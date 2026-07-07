import { Component, inject, OnInit, signal, TemplateRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ProgressStore } from '../../application/progress.store';
import { AutocompleteFilterList } from '../../../shared/presentation/autocomplete-filter-list/autocomplete-filter-list';
import { ProjectProgress } from '../../domain/progress.entity';
import { ProjectsStore } from '../../../projects/application/projects.store';
import { TeamUsersStore } from '../../../team/team-users/application/team-users.store'; //
import { TeamUsersEntity } from '../../../team/team-users/domain/model/team-users.entity';
import { ProgressCalendarComponent } from '../calendar/calendar'; //
import { BudgetStore } from '../../../budget/application/budget-store';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    TranslatePipe,
    AutocompleteFilterList,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ProgressCalendarComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './progress-page.html',
})
export class ProgressPage implements OnInit {
  readonly store = inject(ProgressStore);
  readonly projectsStore = inject(ProjectsStore);
  private readonly teamUsersStore = inject(TeamUsersStore);
  private readonly budgetStore = inject(BudgetStore);
  readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly currentView = signal<'list' | 'create' | 'history'>('list');
  readonly selectedWeather = signal<string>('sunny');
  progressForm: FormGroup;

  readonly selectedParent = signal<ProjectProgress | null>(null);
  readonly formMode = signal<'create_parent' | 'create_child' | 'edit_parent' | 'edit_child'>(
    'create_parent',
  );

  readonly selectedChildId = signal<number | null>(null);

  readonly currentChildren = computed(() => {
    const parent = this.selectedParent();
    return parent ? this.store.getChildrenForActivity(parent.id) : [];
  });

  readonly gestoresOptions = computed(() =>
    this.teamUsersStore
      .teamUsers()
      .filter((user: TeamUsersEntity) => user.role === 'Gestor Operativo')
      .map((user: TeamUsersEntity) => user.fullName),
  );
  readonly specialtiesOptions = ['Estructuras', 'Instalaciones', 'Arquitectura'];
  readonly activityOptions = ['Vaciado de Losa N3', 'Instalación Eléctrica', 'Acabado de Muros'];
  protected readonly mockPhotos = [
    {
      title: 'Excavaciones',
      date: '11/05/2026',
      url: 'https://loremflickr.com/600/400/excavator,construction?lock=1',
    },
    {
      title: 'Cimentación',
      date: '12/05/2026',
      url: 'https://loremflickr.com/600/400/foundation,construction?lock=2',
    },
    {
      title: 'Armado de Columnas',
      date: '13/05/2026',
      url: 'https://loremflickr.com/600/400/rebar,construction?lock=3',
    },
  ];

  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<unknown>;

  constructor() {
    this.progressForm = this.fb.group({
      date: ['', Validators.required],
      specialty: ['', Validators.required],
      activityName: ['', Validators.required],
      location: [''],
      percentage: [0, [Validators.min(0), Validators.max(100)]],
      description: [''],
      responsible: ['', Validators.required],
      workers: [0],
      weather: ['sunny'],
      weight: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const projectId = this.projectsStore.currentProjectId();
    if (projectId) {
      this.teamUsersStore.loadTeamUsers(projectId);
    }
    this.store.loadProgress();
  }

  getSpecialtyKey(specialty: string): string {
    if (!specialty) return 'structures';
    const mapping: Record<string, string> = {
      estructuras: 'structures',
      instalaciones: 'facilities',
      arquitectura: 'architecture',
    };
    return mapping[specialty.toLowerCase()] || 'structures';
  }

  /**
   * Listens to tab selection changes to enforce real-time state synchronization.
   * If the user navigates to the Calendar tab (Index 2), it forces a cache reload.
   */
  onTabChange(event: any): void {
    // Index 2 corresponds to the progress.tabs.calendar view
    if (event.index === 2) {
      this.store.loadProgress();
    }
  }

  openCreateForm(): void {
    this.progressForm.enable();

    const percentageControl = this.progressForm.get('percentage');
    if (percentageControl) {
      percentageControl.setValidators([Validators.min(0), Validators.max(100)]);
      percentageControl.updateValueAndValidity();
    }

    const weightControl = this.progressForm.get('weight');
    if (weightControl) {
      weightControl.setValidators([Validators.required, Validators.min(1)]);
      weightControl.updateValueAndValidity();
    }

    this.progressForm.reset({ percentage: 0, weight: 1, weather: 'sunny' });
    this.selectedWeather.set('sunny');
    this.formMode.set('create_parent');
    this.currentView.set('create');
  }

  openHistory(parent: ProjectProgress): void {
    this.selectedParent.set(parent);
    this.currentView.set('history');
  }

  backToList(): void {
    this.selectedParent.set(null);
    this.currentView.set('list');
  }

  openCreateChildForm(): void {
    const parent = this.selectedParent();
    if (!parent) return;

    this.formMode.set('create_child');
    this.selectedWeather.set('sunny');

    // Business Math: Calculate the sum of current children to establish the remaining buffer
    const currentProgressSum = this.currentChildren().reduce(
      (sum, child) => sum + (Number(child.currentPercentage) || 0),
      0,
    );
    const availablePercentage = 100 - currentProgressSum;

    this.progressForm.reset({
      date: '',
      specialty: parent.specialty,
      activityName: parent.activityName,
      location: parent.details,
      percentage: 0,
      description: '',
      responsible: parent.responsible || '',
      workers: parent.workers || 0,
      weather: 'sunny',
      weight: parent.weight || 1,
    });

    this.progressForm.get('weight')?.disable();

    // Enforce dynamic validator rules to protect percentage boundaries
    const percentageControl = this.progressForm.get('percentage');
    if (percentageControl) {
      percentageControl.setValidators([
        Validators.required,
        this.createMaxPercentageValidator(availablePercentage),
      ]);
      percentageControl.updateValueAndValidity(); // Forces Angular to recalculate validation state
    }

    this.progressForm.get('specialty')?.disable();
    this.progressForm.get('activityName')?.disable();
    this.progressForm.get('responsible')?.disable();
    this.progressForm.get('workers')?.disable();

    this.currentView.set('create');
  }

  openEditParentForm(parent: ProjectProgress): void {
    this.formMode.set('edit_parent');
    this.selectedChildId.set(parent.id);
    this.selectedWeather.set(parent.weather || 'sunny');

    this.progressForm.enable();

    const formattedDate = parent.lastUpdate
      ? new Date(parent.lastUpdate).toISOString().split('T')[0]
      : '';

    this.progressForm.reset({
      date: formattedDate,
      specialty: parent.specialty,
      activityName: parent.activityName,
      location: parent.details,
      percentage: parent.currentPercentage,
      description: parent.details,
      responsible: parent.responsible || '',
      workers: parent.workers || 0,
      weather: parent.weather || 'sunny',
      weight: parent.weight || 1,
    });

    if (this.store.getChildrenForActivity(parent.id).length > 0) {
      this.progressForm.get('percentage')?.disable();
    }

    this.currentView.set('create');
  }

  openEditChildForm(child: ProjectProgress): void {
    const parent = this.selectedParent();
    if (!parent) return;

    this.formMode.set('edit_child');
    this.selectedChildId.set(child.id);
    this.selectedWeather.set(child.weather || 'sunny');

    this.progressForm.enable();
    this.progressForm.get('weight')?.disable();

    const otherChildrenSum = this.currentChildren()
      .filter((c) => c.id !== child.id)
      .reduce((sum, c) => sum + (Number(c.currentPercentage) || 0), 0);
    const availablePercentage = 100 - otherChildrenSum;

    const formattedDate = child.lastUpdate
      ? new Date(child.lastUpdate).toISOString().split('T')[0]
      : '';

    this.progressForm.reset({
      date: formattedDate,
      specialty: parent.specialty,
      activityName: parent.activityName,
      location: child.details,
      percentage: child.currentPercentage,
      description: child.details,
      responsible: child.responsible || parent.responsible || '',
      workers: parent.workers || 0,
      weather: child.weather || 'sunny',
      weight: parent.weight || 1,
    });

    this.progressForm.get('weight')?.disable();

    const percentageControl = this.progressForm.get('percentage');
    if (percentageControl) {
      percentageControl.setValidators([
        Validators.required,
        this.createMaxPercentageValidator(availablePercentage),
      ]);
      percentageControl.updateValueAndValidity();
    }

    this.progressForm.get('specialty')?.disable();
    this.progressForm.get('activityName')?.disable();
    this.progressForm.get('responsible')?.disable();
    this.progressForm.get('workers')?.disable();

    this.currentView.set('create');
  }

  setWeather(type: string): void {
    this.selectedWeather.set(type);
    this.progressForm.patchValue({ weather: type });
  }

  onDateRangeChange(start: Date | null, end: Date | null): void {
    this.store.setDateRange(start, end);
  }

  saveProgress(): void {
    if (this.progressForm.valid) {
      const val = this.progressForm.getRawValue();
      const mode = this.formMode();
      const parent = this.selectedParent();
      const targetId = this.selectedChildId();

      const currentId = this.projectsStore.currentProjectId() || 'unknown';
      const projectName = this.projectsStore.currentProject()?.name || 'Unknown Project';

      const isChild = mode === 'create_child' || mode === 'edit_child';
      const isEditing = mode === 'edit_parent' || mode === 'edit_child';

      if (mode === 'create_parent') {
        const generatedParentId = Math.floor(Math.random() * 10000);

        const parentEntry: ProjectProgress = {
          id: generatedParentId,
          projectId: currentId,
          projectName: projectName,
          activityName: val.activityName,
          details: val.location || '',
          specialty: val.specialty,
          status: val.percentage === 100 ? 'Finished' : 'Active',
          currentPercentage: 0,
          startDate: new Date(),
          endDate: new Date(),
          lastUpdate: val.date ? new Date(val.date) : new Date(),
          responsible: val.responsible,
          workers: Number(val.workers),
          weather: val.weather,
          isMiniAdvance: false,
          parentId: null,
          weight: Number(val.weight || 1),
        };

        const initialChildEntry: ProjectProgress = {
          id: Math.floor(Math.random() * 10000),
          projectId: currentId,
          projectName: projectName,
          activityName: val.activityName,
          details: val.location || '',
          specialty: val.specialty,
          status: val.percentage === 100 ? 'Finished' : 'Active',
          currentPercentage: Number(val.percentage),
          startDate: new Date(),
          endDate: new Date(),
          lastUpdate: val.date ? new Date(val.date) : new Date(),
          responsible: val.responsible,
          workers: Number(val.workers),
          weather: val.weather,
          isMiniAdvance: true,
          parentId: generatedParentId,
        };

        this.store.addProgress(parentEntry, (saved) => {
          this.budgetStore.createBudgetItem(saved);
        });
        setTimeout(() => this.store.addProgress(initialChildEntry), 100);

        this.progressForm.enable();
        setTimeout(() => {
          this.store.loadProgress();
          this.currentView.set('list');
        }, 250);
        return;
      }

      const entryData: ProjectProgress = {
        id: isEditing && targetId ? targetId : Math.floor(Math.random() * 10000),
        projectId: currentId,
        projectName: projectName,
        activityName: val.activityName,
        details: val.location || '',
        specialty: val.specialty,
        status: val.percentage === 100 ? 'Finished' : 'Active',
        currentPercentage: Number(val.percentage),
        startDate: new Date(),
        endDate: new Date(),
        lastUpdate: val.date ? new Date(val.date) : new Date(),
        responsible: val.responsible,
        workers: Number(val.workers),
        weather: val.weather,
        isMiniAdvance: isChild,
        parentId: isChild && parent ? parent.id : null,
        weight: !isChild ? Number(val.weight || 1) : undefined,
      };

      if (isEditing && targetId) {
        if (mode === 'edit_parent') {
          this.selectedParent.set(entryData);
        }
        this.store.updateProgress(targetId, entryData);
      } else {
        this.store.addProgress(entryData);
      }

      this.progressForm.enable();
      this.selectedChildId.set(null);

      setTimeout(() => {
        this.store.loadProgress();
        if (mode === 'edit_parent' && parent) {
          const freshParent = this.store.progressList().find((p) => p.id === parent.id);
          if (freshParent) {
            this.selectedParent.set(freshParent);
          }
        }
        this.currentView.set(isChild ? 'history' : 'list');
      }, 150);
    }
  }

  cancelCreation(): void {
    const targetView = this.formMode().includes('child') ? 'history' : 'list';

    const wasEditing = this.formMode().startsWith('edit');
    const savedId = this.selectedChildId();
    if (wasEditing) {
      this.selectedChildId.set(null);
    }

    if (this.progressForm.dirty) {
      this.dialog
        .open(this.confirmDialogTemplate)
        .afterClosed()
        .subscribe((res) => {
          if (res === 'discard') {
            this.progressForm.enable();
            this.currentView.set(targetView);
          } else if (wasEditing && savedId) {
            this.selectedChildId.set(savedId);
          }
        });
    } else {
      this.progressForm.enable();
      this.currentView.set(targetView);
    }
  }

  onSpecialtySelected(v: string): void {
    this.store.setSpecialtyFilter(v);
  }
  onSearchChange(v: string): void {
    this.store.setSearchFilter(v);
  }

  getStatusBadgeClass(s: string): string {
    const b = 'px-3 py-1 rounded-s text-xs font-bold uppercase tracking-wider border';
    return s === 'Finished'
      ? `${b} bg-success/10 text-success border-success/20`
      : `${b} bg-primary/10 text-primary border-primary/20`;
  }

  /**
   * Generates a custom synchronous validator to protect the 100% progress threshold.
   * Ensures the new entry combined with existing child logs does not exceed 100%.
   */
  private createMaxPercentageValidator(availablePercentage: number) {
    return (control: any) => {
      const value = Number(control.value) || 0;

      if (value < 0) {
        return { negativePercentage: true }; // Triggers an error if value is lower than 0
      }

      if (value > availablePercentage) {
        return { exceededLimit: { maxAllowed: availablePercentage, actual: value } }; // Triggers an error if it surpasses the limit
      }

      return null; // Validator passes successfully
    };
  }
  deleteProgressWithConfirmation(id: number, isChildView: boolean): void {
    this.formMode.set('edit_child');
    this.selectedChildId.set(id);

    this.dialog
      .open(this.confirmDialogTemplate)
      .afterClosed()
      .subscribe((res) => {
        if (res === 'discard') {
          // 1. Clear the component local reference memory state instantly to allow standard calculations
          this.store._progressList.update((list) =>
            list.filter((item) => item.id !== id && item.parentId !== id),
          );

          // 2. Dispatch cascade deletion commands array loop
          this.store.removeProgress(id);
          this.progressForm.enable();
          this.selectedChildId.set(null);

          if (!isChildView) {
            this.backToList();
          }
        } else {
          this.progressForm.enable();
          this.selectedChildId.set(null);
        }
      });
  }

  navigateToEditFromCalendar(child: ProjectProgress): void {
    const allProgress = this.store._progressList();
    const parent = allProgress.find((p) => p.id === child.parentId && !p.isMiniAdvance);
    if (parent) {
      this.selectedParent.set(parent);
      this.openEditChildForm(child);
    }
  }

  /**
   * Technical utility to compute and return the remaining progress allocation headroom for the UI translations.
   */
  getMaxAllowedBuffer(): number {
    const parent = this.selectedParent();
    if (!parent) return 100;

    const currentProgressSum = this.currentChildren()
      .filter((c) => c.id !== this.selectedChildId())
      .reduce((sum, child) => sum + (Number(child.currentPercentage) || 0), 0);

    const buffer = 100 - currentProgressSum;
    return buffer < 0 ? 0 : buffer;
  }
}
