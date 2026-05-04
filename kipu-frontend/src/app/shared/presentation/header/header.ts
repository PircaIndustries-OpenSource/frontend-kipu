import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { LogisticsStore } from '../../../logistics/application/logistics.store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatBadgeModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  currentProject = input<string>();
  logisticsStore = inject(LogisticsStore);
  unreadRequest = this.logisticsStore.hasNotifications;
}
