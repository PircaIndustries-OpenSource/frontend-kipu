import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router, RouterModule } from '@angular/router';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { NotificationService, AppNotification } from '../../application/notification.service';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule,
    LanguageSwitcher,
    PopoverModule,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  currentProject = input<string>();
  notificationService = inject(NotificationService);
  router = inject(Router);

  // Return the active url to support back path routing
  get currentUrl(): string {
    return this.router.url;
  }

  // Helper method to navigate to the detailed notifications list
  goToAllNotifications() {
    this.router.navigate(['/notifications'], { queryParams: { from: this.currentUrl } });
  }

  // Handles clicking on a notification item inside the dropdown overlay
  selectNotification(notification: AppNotification, overlayPanel: any) {
    overlayPanel.hide();
    this.notificationService.markAsRead(notification.id);
    this.router.navigateByUrl(notification.route);
  }

  // Handles dismissing a notification inside the dropdown overlay without trigger routing
  dismissNotification(event: Event, id: string) {
    event.stopPropagation();
    this.notificationService.dismissNotification(id);
  }
}
