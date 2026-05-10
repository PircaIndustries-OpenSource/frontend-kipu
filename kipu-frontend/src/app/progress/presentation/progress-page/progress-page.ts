import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ProgressStore } from '../../application/progress.store';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './progress-page.html',
})
export class ProgressPage implements OnInit {
  // Inject the Store instead of the API directly
  readonly store = inject(ProgressStore);

  ngOnInit(): void {
    // Load data through the store
    this.store.loadProgress();
  }

  getStatusBadgeClass(status: string): string {
    const base = 'px-3 py-1 rounded-md text-xs font-bold uppercase';
    switch (status) {
      case 'Finished':
        return `${base} bg-green-100 text-green-600`;
      case 'Active':
        return `${base} bg-blue-100 text-blue-500`;
      case 'Delayed':
        return `${base} bg-red-100 text-red-500`;
      default:
        return `${base} bg-gray-100 text-gray-500`;
    }
  }
}
