import { Component, inject, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RncStore } from '../../application/rnc.store';
import { TeamUsersStore } from '../../../team/team-users/application/team-users.store';
import { ProjectStateService } from '../../../shared/application/project-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rnc-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './rnc-create-page.component.html',
})
export class RncCreatePageComponent {
  private fb = inject(FormBuilder);
  private store = inject(RncStore);
  private projectService = inject(ProjectStateService);
  private teamUsersStore = inject(TeamUsersStore);
  protected router = inject(Router);
  protected users = computed(() => this.teamUsersStore.teamUsers().filter((u) => u.isActive));

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    specialty: ['Structures', Validators.required],
    location: ['', Validators.required],
    severity: ['Low', Validators.required],
    images: [[]],
    reportedBy: [''],
  });

  ngOnInit() {
    this.teamUsersStore.loadIamUsers();
  }

  save(): void {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        id: crypto.randomUUID(),
        projectId: this.projectService.currentProjectId(),
        status: 'Created',
        reportedBy: 'current-user-id',
        reportDate: new Date(),
      };

      this.store.create(payload as any);
      this.router.navigate(['/rnc']);
    } else {
      console.log('Formulario inválido:', this.form.errors);
    }
  }

  cancel(): void {
    this.router.navigate(['/rnc']);
  }
}
