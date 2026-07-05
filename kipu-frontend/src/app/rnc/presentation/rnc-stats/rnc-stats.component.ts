import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-rnc-stats',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-sm border border-neutral-border/20 h-full">
      <h3 class="text-xs font-black text-primary uppercase tracking-widest mb-4">
        {{ 'general.summary' | translate }}
      </h3>
      <div class="text-center">
        <p class="text-4xl font-black text-accent">86%</p>
        <p class="text-sm text-neutral-border">Resolution Rate</p>
      </div>
    </div>
  `,
})
export class RncStatsComponent {}
