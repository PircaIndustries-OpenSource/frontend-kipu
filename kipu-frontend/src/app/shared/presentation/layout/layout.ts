import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './layout.html',
})
export class Layout {}
