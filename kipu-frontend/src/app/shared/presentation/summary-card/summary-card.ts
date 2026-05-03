import {Component, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-summary-card',
  imports: [MatCardModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css',
})
export class SummaryCard {
  title = input.required<string>();
  value = input.required<number>();
}
