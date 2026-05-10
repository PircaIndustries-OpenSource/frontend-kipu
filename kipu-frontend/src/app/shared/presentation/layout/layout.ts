import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { ProjectsStore } from '../../../projects/application/projects.store';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, RouterOutlet, Header],
  templateUrl: './layout.html',
})
export class Layout {
  projectsStore = inject(ProjectsStore);
  currentProject = this.projectsStore.currentProject;
}
