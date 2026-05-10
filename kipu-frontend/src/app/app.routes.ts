import { Routes } from '@angular/router';
import { RegisterComponent } from './presentation/components/register/register.component';
import { Layout } from './shared/presentation/layout/layout';
import { LogisticsPage } from './logistics/presentation/logistics-page/logistics-page';
import { TeamPage } from './team/presentation/team-page/team-page';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'logistics',
        component: LogisticsPage,
        children: [
          {
            path: '',
            redirectTo: 'inventory',
            pathMatch: 'full',
          },
          {
            path: 'inventory',
            loadComponent: () =>
              import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
                (m) => m.InventoryPage,
              ),
          },
          {
            path: 'request/create',
            loadComponent: () =>
              import('./logistics/presentation/request/request-create/create-form/request-create').then(
                (m) => m.RequestCreate,
              ),
          },
          {
            path: 'requests',
            loadComponent: () =>
              import('./logistics/presentation/request/request-page/request-page').then(
                (m) => m.RequestPage,
              ),
          },
          {
            path: 'machinery',
            loadComponent: () =>
              import('./logistics/presentation/machinery/machinery-page/machinery-page').then(
                (m) => m.MachineryPage,
              ),
          },
          {
            path: 'suppliers',
            loadComponent: () =>
              import('./logistics/presentation/suppliers/suppliers-page/suppliers-page').then(
                (m) => m.SuppliersPage,
              ),
          },
          {
            path: 'waste',
            loadComponent: () =>
              import('./logistics/presentation/waste/waste-page/waste-page').then(
                (m) => m.WastePage,
              ),
          },
        ],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
      },
      {
        path: 'advances',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
      },
      {
        path: 'rnc',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
      },
      {
        path: 'blueprints',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
      },
      {
        path: 'signatures',
        loadComponent: () =>
          import('./signatures/document/presentation/document-page/document-page').then(
            (m) => m.DocumentPage,
          ),
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./logistics/presentation/budget/budget-page/budget-page').then(
            (m) => m.BudgetPage,
          ),
      },
      {
        path: 'team',
        component: TeamPage,
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./team/team-users/presentation/users-page/users-page').then(
                (m) => m.UsersPage,
              ),
          },
          {
            path: 'workers',
            loadComponent: () =>
              import('./team/team-workers/presentation/workers-page/workers-page').then(
                (m) => m.WorkersPage,
              ),
          },
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'iot',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
      },
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full',
      },
    ],
  },
];
