import { Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
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
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './progress-page.html',
})
export class ProgressPage implements OnInit {
  readonly store = inject(ProgressStore);
  private readonly projectsStore = inject(ProjectsStore);
  readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly currentView = signal<'list' | 'create'>('list');
  readonly selectedWeather = signal<string>('sunny');
  progressForm: FormGroup;

  readonly specialtiesOptions = ['Estructuras', 'Instalaciones', 'Arquitectura'];
  readonly activityOptions = ['Vaciado de Losa N3', 'Instalación Eléctrica', 'Acabado de Muros'];
  protected readonly mockPhotos = [
    { title: 'Excavaciones', date: '11/05/2026', url: 'https://loremflickr.com/600/400/excavator,construction?lock=1' },
    { title: 'Cimentación', date: '12/05/2026', url: 'https://loremflickr.com/600/400/foundation,construction?lock=2' },
    { title: 'Armado de Columnas', date: '13/05/2026', url: 'https://loremflickr.com/600/400/rebar,construction?lock=3' }
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
      responsible: [''],
      workers: [0],
      weather: ['sunny'],
    });
  }

  ngOnInit(): void {
    this.store.loadProgress();
  }

  openCreateForm(): void {
    this.progressForm.reset({ percentage: 0, weather: 'sunny' });
    this.selectedWeather.set('sunny');
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
      const val = this.progressForm.value;

      // Get current project context from store
      const currentId = this.projectsStore.currentProjectId() || 'unknown';
      const projectName = this.projectsStore.currentProject()?.name || 'Unknown Project';

      const newEntry: ProjectProgress = {
        id: Math.floor(Math.random() * 10000), // json-server will generate a permanent ID, but we send a temporary one
        projectId: currentId, // Dynamic project assignment
        projectName: projectName,
        activityName: val.activityName,
        details: val.location || '',
        specialty: val.specialty,
        status: val.percentage === 100 ? 'Finished' : 'Active',
        currentPercentage: val.percentage,
        startDate: new Date(),
        endDate: new Date(),
        lastUpdate: new Date(val.date),
        responsible: val.responsible,
        workers: val.workers,
        weather: val.weather,
      };

      this.store.addProgress(newEntry);
      this.currentView.set('list');
    }
  }

  cancelCreation(): void {
    if (this.progressForm.dirty) {
      this.dialog
        .open(this.confirmDialogTemplate)
        .afterClosed()
        .subscribe((res) => {
          if (res === 'discard') this.currentView.set('list');
        });
    } else {
      this.currentView.set('list');
    }
  }

  onSpecialtySelected(v: string): void {
    this.store.setSpecialtyFilter(v);
  }
  onSearchChange(v: string): void {
    this.store.setSearchFilter(v);
  }

  getStatusBadgeClass(s: string): string {
    const b = 'px-3 py-1 rounded-md text-xs font-bold uppercase';
    return s === 'Finished'
      ? `${b} bg-green-100 text-emerald-600`
      : `${b} bg-blue-100 text-blue-500`;
  }
}
