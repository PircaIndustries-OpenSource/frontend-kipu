import { Injectable, signal, computed, inject, effect, DestroyRef } from '@angular/core';
import { ProjectStateService } from './project-state.service';
import { AuthStore } from '../../identity/application/auth.store';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { interval, Subscription, startWith, switchMap } from 'rxjs';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: string;
  route: string;
  projectId: string;
  read: boolean;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private projectStateService = inject(ProjectStateService);
  private authStore = inject(AuthStore);
  private http = inject(HttpClient);

  private notificationsSignal = signal<AppNotification[]>([]);

  // All notifications
  readonly notifications = this.notificationsSignal.asReadonly();

  // Notifications filtered by active project ID (excludes invitations)
  readonly projectNotifications = computed(() => {
    const activeId = this.projectStateService.currentProjectId();
    return this.notificationsSignal()
      .filter((n) => n.type !== 'invitacion')
      .filter((n) => n.projectId === activeId || !n.projectId || n.projectId === '')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // Count of unread notifications for the active project
  readonly unreadCount = computed(() => {
    return this.projectNotifications().filter((n) => !n.read).length;
  });

  // Keep a computed list of the latest 3 notifications for the dropdown
  readonly latestThreeNotifications = computed(() => {
    return this.projectNotifications().slice(0, 3);
  });

  // Pending invitations (not filtered by project)
  readonly pendingInvitations = computed(() => {
    return this.notificationsSignal()
      .filter((n) => n.type === 'invitacion' && !n.read)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  readonly pendingInvitationsCount = computed(() => {
    return this.pendingInvitations().length;
  });

  private pollingSubscription: Subscription | null = null;
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Load initial state
    try {
      const stored = localStorage.getItem('kipu-notifications');
      if (stored) {
        this.notificationsSignal.set(JSON.parse(stored));
      } else {
        // Initial mock notifications if empty
        const initialMock: AppNotification[] = [
          {
            id: 'notif-1',
            title: 'Desviación de Presupuesto Detectada',
            description: 'El material "Acero Corrugado 1/2" en la solicitud supera el costo estimado por unidad.',
            type: 'presupuesto',
            route: '/budget',
            projectId: 'proj-02',
            read: false,
            date: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'notif-2',
            title: 'Firma Pendiente',
            description: 'Tiene un plano técnico pendiente de firma para la fase 2.',
            type: 'firma',
            route: '/signatures',
            projectId: 'proj-02',
            read: false,
            date: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 'notif-3',
            title: 'Stock Crítico de Cemento',
            description: 'El stock de Cemento Portland está por debajo del límite mínimo.',
            type: 'inventario',
            route: '/logistics/inventory',
            projectId: 'proj-02',
            read: true,
            date: new Date(Date.now() - 86400000).toISOString(),
          }
        ];
        this.notificationsSignal.set(initialMock);
        localStorage.setItem('kipu-notifications', JSON.stringify(initialMock));
      }
    } catch (e) {
      console.error('Failed to parse notifications from localStorage', e);
    }

    // Reactively save to localStorage when changes occur
    effect(() => {
      localStorage.setItem('kipu-notifications', JSON.stringify(this.notificationsSignal()));
    });

    // Reactively load invitations when current user changes, with polling
    effect(() => {
      const user = this.authStore.currentUser();
      if (user?.email) {
        this.loadInvitations(user.email);
        this.startPolling(user.email);
      } else {
        this.stopPolling();
      }
    });

    this.destroyRef.onDestroy(() => this.stopPolling());
  }

  addNotification(notification: {
    title: string;
    description: string;
    type: string;
    route: string;
    projectId: string;
  }) {
    const newNotif: AppNotification = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      ...notification,
      read: false,
      date: new Date().toISOString(),
    };
    this.notificationsSignal.update((list) => [newNotif, ...list]);
  }

  markAsRead(id: string) {
    this.notificationsSignal.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllAsRead() {
    const activeId = this.projectStateService.currentProjectId();
    if (!activeId) return;
    this.notificationsSignal.update((list) =>
      list.map((n) => (n.projectId === activeId ? { ...n, read: true } : n))
    );
  }

  dismissNotification(id: string) {
    this.notificationsSignal.update((list) => list.filter((n) => n.id !== id));
  }

  checkBudgetDeviation(transaction: any, budgetItem: any) {
    const limit = budgetItem.estimatedLimit || (budgetItem.budgeted ? budgetItem.budgeted / 100 : 100);
    const unitPrice = transaction.unitPrice || transaction.pricePerUnit || 0;
    const itemName = transaction.itemName || transaction.materialName || 'Material';

    if (unitPrice > limit) {
      this.addNotification({
        title: 'Desviación de Presupuesto Detectada',
        description: `El material "${itemName}" en la solicitud supera el costo estimado por unidad de ${limit}.`,
        type: 'presupuesto',
        route: `/budget`,
        projectId: this.projectStateService.currentProjectId() || '',
      });
    }
  }

  private startPolling(email: string) {
    this.stopPolling();
    this.pollingSubscription = interval(30000)
      .pipe(startWith(0))
      .subscribe(() => this.loadInvitations(email));
  }

  private stopPolling() {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  loadInvitations(email: string) {
    this.http.get<any[]>(`${environment.kipuApiBaseUrl}/invitations/user/${encodeURIComponent(email)}`).subscribe({
      next: (invitations) => {
        const pendingIds = new Set(
          invitations.filter((inv: any) => inv.status === 'PENDING').map((inv: any) => `inv-${inv.id}`)
        );

        // Remove stale invitation notifications that no longer exist
        this.notificationsSignal.update((list) =>
          list.filter((n) => n.type !== 'invitacion' || pendingIds.has(n.id))
        );

        // Add new invitations
        invitations.filter((inv: any) => inv.status === 'PENDING').forEach((inv: any) => {
          const exists = this.notificationsSignal().find(n => n.id === `inv-${inv.id}`);
          if (!exists) {
            const projectDisplay = inv.projectName || 'un proyecto';
            const inviterDisplay = inv.invitedBy || 'Alguien';
            const newNotif: AppNotification = {
              id: `inv-${inv.id}`,
              title: `Invitación: ${projectDisplay}`,
              description: `${inviterDisplay} te ha invitado con rol: ${inv.role}`,
              type: 'invitacion',
              route: `/invitations/${inv.id}`,
              projectId: '',
              read: false,
              date: new Date().toISOString(),
            };
            this.notificationsSignal.update((list) => [newNotif, ...list]);
          }
        });
      },
      error: (err) => console.error('Error fetching invitations', err)
    });
  }

  dismissInvitationNotification(invitationId: number) {
    this.notificationsSignal.update((list) =>
      list.filter((n) => n.id !== `inv-${invitationId}`)
    );
    this.dismissNotification(`inv-${invitationId}`);
  }
}
