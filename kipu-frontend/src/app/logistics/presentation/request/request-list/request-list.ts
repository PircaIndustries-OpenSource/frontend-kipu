import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RequestItem } from '../request-item/request-item';
import { EnrichedRequest } from '../../../application/logistics.store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-request-list',
  imports: [RequestItem, TranslatePipe, MatIcon],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css',
})
export class RequestList {
  requests = input.required<EnrichedRequest[]>();
  availableBudget = input.required<number>();
  totalBudget = input.required<number>();
}
