import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { ProjectStateService } from './project-state.service';

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

  private notificationsSignal = signal<AppNotification[]>([]);

  // All notifications
  readonly notifications = this.notificationsSignal.asReadonly();

  // Notifications filtered by active project ID
  readonly projectNotifications = computed(() => {
    const activeId = this.projectStateService.currentProjectId();
    if (!activeId) return [];
    return this.notificationsSignal()
      .filter((n) => n.projectId === activeId)
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
}
