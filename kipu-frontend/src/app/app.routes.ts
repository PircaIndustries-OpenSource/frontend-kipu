import { Routes } from '@angular/router';
import { RegisterComponent } from './presentation/components/register/register.component';
import { Layout } from './shared/presentation/layout/layout';

export const routes: Routes = [
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'inventory',
        loadComponent: () => import('./logistics/presentation/inventory/inventory-page/inventory-page').then(m => m.InventoryPage)
      },
      {
        path: 'request',
        loadComponent: () => import('./logistics/presentation/request/request-page/request-page').then(m => m.RequestPage)
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  }
];