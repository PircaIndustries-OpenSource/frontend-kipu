import { Routes } from '@angular/router';
import {Layout} from './shared/presentation/layout/layout';
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'inventory',
        loadComponent: () =>
          import('./logistics/presentation/inventory/inventory-page/inventory-page').then(m => m.InventoryPage)
      },
      {
        path: 'request',
        loadComponent: () =>
          import('./logistics/presentation/request/request-page/request-page').then(m => m.RequestPage)
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  }
];
