import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, RouterOutlet, Header],
  templateUrl: './layout.html',
})
export class Layout {}
