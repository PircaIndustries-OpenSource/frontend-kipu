import { Routes } from '@angular/router';
import { RegisterComponent } from './identity/presentation/components/register/register.component';
import { Layout } from './shared/presentation/layout/layout';
import { LogisticsPage } from './logistics/presentation/logistics-page/logistics-page';
import { LoginComponent } from './identity/presentation/components/login/login.component';
import { TeamPage } from './team/presentation/team-page/team-page';
import { IotMonitoringDashboard } from './iot-monitoring/presentation/dashboard/iot-monitoring-dashboard/iot-monitoring-dashboard';
import { projectSelectedGuard } from './projects/application/guards/project-selected.guard';
import { authGuard } from './identity/application/guards/auth.guard';

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
    loadComponent: () =>
      import('./identity/presentation/components/verification/verification.component').then(
        (m) => m.VerificationComponent,
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./identity/presentation/components/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./identity/presentation/components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
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
        canActivate: [projectSelectedGuard],
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
        path: 'machinery',
        canActivate: [projectSelectedGuard],
        loadComponent: () =>
          import('./logistics/presentation/machinery/machinery-page/machinery-page').then(
            (m) => m.MachineryPage,
          ),
      },
      /*'./progress/presentation/progress-page/progress-page.component'*/
      {
        path: 'advances',
        canActivate: [projectSelectedGuard],
        loadComponent: () =>
          import('./progress/presentation/progress-page/progress-page').then((m) => m.ProgressPage),
      },
      // src/app/app.routes.ts

      {
        path: 'rnc',
        canActivate: [projectSelectedGuard],
        loadComponent: () =>
          import('./rnc/presentation/rnc-page/rnc-page.component').then((m) => m.RncPageComponent),
      },
      {
        path: 'rnc/create',
        loadComponent: () =>
          import('./rnc/presentation/rnc-create-page/rnc-create-page.component').then(
            (m) => m.RncCreatePageComponent,
          ),
      },
      {
        path: 'signatures',
        canActivate: [projectSelectedGuard],
        loadComponent: () =>
          import('./signatures/document/presentation/document-page/document-page').then(
            (m) => m.DocumentPage,
          ),
      },
      {
        path: 'budget',
        canActivate: [projectSelectedGuard],
        loadComponent: () =>
          import('./budget/presentation/budget-page/budget-page').then((m) => m.BudgetPage),
      },
      {
        path: 'team',
        component: TeamPage,
        canActivate: [projectSelectedGuard],
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
        path: 'iot-monitoring',
        component: IotMonitoringDashboard,
        canActivate: [projectSelectedGuard],
        children: [
          {
            path: '',
            redirectTo: 'iot-monitoring',
            pathMatch: 'full',
          },
          {
            path: 'iot',
            loadComponent: () =>
              import('./iot-monitoring/presentation/dashboard/iot-monitoring-dashboard/iot-monitoring-dashboard').then(
                (m) => m.IotMonitoringDashboard,
              ),
          },
          {
            path: 'concrete-curing',
            loadComponent: () =>
              import('./iot-monitoring/presentation/components/concrete-curing/concrete-curing').then(
                (m) => m.ConcreteCuring,
              ),
          },
          {
            path: 'hopper-watch',
            loadComponent: () =>
              import('./iot-monitoring/presentation/components/hopper-watch/hopper-watch').then(
                (m) => m.HopperWatch,
              ),
          },
          {
            path: 'geolocalization',
            loadComponent: () =>
              import('./iot-monitoring/presentation/components/geolocalization-and-geofence/geolocalization-and-geofence').then(
                (m) => m.GeolocalizationAndGeofence,
              ),
          },
          {
            path: 'seismic-control',
            loadComponent: () =>
              import('./iot-monitoring/presentation/components/seismic-control/seismic-control').then(
                (m) => m.SeismicControl,
              ),
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./shared/presentation/settings/settings').then((m) => m.SettingsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./shared/presentation/notifications/notifications').then(
            (m) => m.NotificationsComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
    ],
  },
];
