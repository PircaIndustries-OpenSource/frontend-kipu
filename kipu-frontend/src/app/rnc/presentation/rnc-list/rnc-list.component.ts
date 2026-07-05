import { Component, input } from '@angular/core';
import { RncItemComponent } from '../rnc-item/rnc-item.component';
import { RncEntity } from '../../domain/model/rnc.entity';

@Component({
  selector: 'app-rnc-list',
  standalone: true,
  imports: [RncItemComponent],
  template: `
    <div class="grid gap-4">
      @for (rnc of rncs(); track rnc.id) {
        <app-rnc-item [rnc]="rnc"></app-rnc-item>
      }
    </div>
  `,
})
export class RncListComponent {
  rncs = input.required<RncEntity[]>();
}
