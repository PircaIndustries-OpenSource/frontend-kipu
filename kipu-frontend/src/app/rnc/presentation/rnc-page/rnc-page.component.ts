import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { RncStore } from '../../application/rnc.store';
import { RncListComponent } from '../rnc-list/rnc-list.component';
import { RncCreateDialogComponent } from '../rnc-create-dialog/rnc-create-dialog.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rnc-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, RncListComponent, FormsModule],
  templateUrl: './rnc-page.component.html',
})
export class RncPageComponent implements OnInit {
  protected store = inject(RncStore);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  searchTerm = signal('');

  stats = computed(() => {
    const all = this.store.rncs();
    const active = all.filter((r) => r.status !== 'Solved');

    return {
      total: all.length,
      critical: active.filter((r) => r.severity === 'Critical').length,
      moderate: active.filter((r) => r.severity === 'Moderate').length,
      low: active.filter((r) => r.severity === 'Low').length,
      solved: all.filter((r) => r.status === 'Solved').length,
    };
  });

  filteredRncs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.store.rncs().filter((rnc) => rnc.title.toLowerCase().includes(term));
  });

  summaryData = computed(() => {
    const all = this.store.rncs();
    const solved = all.filter((r) => r.status === 'Solved');

    const totalTime = solved.reduce((acc, r) => {
      const start = new Date(r.reportDate).getTime();
      const end = r.resolutionDate ? new Date(r.resolutionDate).getTime() : new Date().getTime();
      return acc + (end - start);
    }, 0);

    const counts: Record<string, number> = {};
    all.forEach((r) => (counts[r.specialty] = (counts[r.specialty] || 0) + 1));
    const mostFrequent = Object.keys(counts).reduce(
      (a, b) => (counts[a] > counts[b] ? a : b),
      'None',
    );

    return {
      avgDays: solved.length ? Math.floor(totalTime / solved.length / (1000 * 60 * 60 * 24)) : 0,
      mostFrequent,
      rate: all.length ? Math.round((solved.length / all.length) * 100) : 0,
    };
  });

  ngOnInit(): void {
    this.store.loadAll();
  }

  goToCreate(): void {
    this.router.navigate(['/rnc/create']);
  }
}
