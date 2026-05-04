import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/layout/layout';
import { LoginComponent } from './identity/presentation/components/login/login.component';
import { RegisterComponent } from './identity/presentation/components/register/register.component';

export const routes: Routes = [
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
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'system',
    component: Layout,
    children: [
      {
        path: 'inventory',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
      },
      {
        path: 'request',
        loadComponent: () =>
          import('./logistics/presentation/request/request-page/request-page').then(
            (m) => m.RequestPage,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(
            (m) => m.InventoryPage,
          ),
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
