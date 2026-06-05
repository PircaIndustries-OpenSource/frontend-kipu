import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationService, AppNotification } from '../../application/notification.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  host: {
    class: 'block w-full h-full'
  },
  styles: [`
    :host {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
    }
  `],
  imports: [
    CommonModule,
    ButtonModule,
    TranslateModule,
    RouterModule
  ],
  templateUrl: './notifications.html',
})
export class NotificationsComponent implements OnInit {
  notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  backPath: string = '/projects';
  currentTab: 'all' | 'unread' = 'all';

  get filteredNotifications(): AppNotification[] {
    const list = this.notificationService.projectNotifications();
    if (this.currentTab === 'unread') {
      return list.filter((n) => !n.read);
    }
    return list;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.backPath = params['from'] || '/projects';
    });
  }

  goBack() {
    this.router.navigateByUrl(this.backPath);
  }

  selectNotification(notification: AppNotification) {
    this.notificationService.markAsRead(notification.id);
    this.router.navigateByUrl(notification.route);
  }

  markAsRead(event: Event, id: string) {
    event.stopPropagation();
    this.notificationService.markAsRead(id);
  }

  dismiss(event: Event, id: string) {
    event.stopPropagation();
    this.notificationService.dismissNotification(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'presupuesto':
        return 'pi pi-money-bill text-yellow-600 bg-yellow-100';
      case 'firma':
        return 'pi pi-pencil text-blue-600 bg-blue-100';
      case 'inventario':
        return 'pi pi-box text-red-600 bg-red-100';
      default:
        return 'pi pi-bell text-slate-600 bg-slate-100';
    }
  }
}
