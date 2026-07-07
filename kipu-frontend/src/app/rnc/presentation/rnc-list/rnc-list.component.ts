import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RncItemComponent } from '../rnc-item/rnc-item.component';
import { RncEntity } from '../../domain/model/rnc.entity';

@Component({
  selector: 'app-rnc-list',
  standalone: true,
  imports: [RncItemComponent, TranslatePipe, MatIcon],
  template: `
    <div class="grid gap-4">
      @for (rnc of rncs(); track rnc.id) {
        <app-rnc-item [rnc]="rnc"></app-rnc-item>
      } @empty {
        <div class="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-neutral-border/30 rounded-xl">
          <mat-icon class="text-5xl text-neutral-border/40 mb-4">report</mat-icon>
          <p class="text-neutral-border font-medium text-lg">{{ 'rnc.empty' | translate }}</p>
        </div>
      }
    </div>
  `,
})
export class RncListComponent {
  rncs = input.required<RncEntity[]>();
}
