import {Component, input} from '@angular/core';
import {RequestItem} from '../request-item/request-item';
import {RequestViewModel } from '../../../domain/request.entity';

@Component({
  selector: 'app-request-list',
  imports: [RequestItem],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css',
})
export class RequestList {
  requests = input.required<RequestViewModel[]>();
  availableBudget = input.required<number>();
  totalBudget = input.required<number>();
}
