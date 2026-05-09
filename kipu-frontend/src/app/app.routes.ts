import { Routes } from '@angular/router';
import { RegisterComponent } from './identity/presentation/components/register/register.component';
import { Layout } from './shared/presentation/layout/layout';
import { LogisticsPage } from './logistics/presentation/logistics-page/logistics-page';
import { LoginComponent } from './identity/presentation/components/login/login.component';
import { TeamPage } from './team/presentation/team-page/team-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verification',
    loadComponent: () => import('./identity/presentation/components/verification/verification.component').then(m => m.VerificationComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./identity/presentation/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./identity/presentation/components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/presentation/projects-dashboard/projects-dashboard.component').then(
            (m) => m.ProjectsDashboardComponent,
          ),
      },
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
              import('./logistics/presentation/request/request-create/create-page/create-page').then(
                (m) => m.CreatePage,
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