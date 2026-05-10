import {Component, input} from '@angular/core';
import {RequestItem} from '../request-item/request-item';
import {EnrichedRequest } from '../../../application/logistics.store';

@Component({
  selector: 'app-request-list',
  imports: [RequestItem],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css',
})
export class RequestList {
  requests = input.required<EnrichedRequest[]>();
  availableBudget = input.required<number>();
  totalBudget = input.required<number>();
}
