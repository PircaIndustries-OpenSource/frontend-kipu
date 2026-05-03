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
          import('./logistics/presentation/inventory-page/inventory-page').then(m => m.InventoryPage)
      },
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      }
    ]
  }
];
