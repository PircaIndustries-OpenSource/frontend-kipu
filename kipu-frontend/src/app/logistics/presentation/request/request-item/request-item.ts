import {Component, computed, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {RequestEntity} from '../../../domain/request.entity';
import {TranslatePipe} from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-request-item',
  imports: [MatCardModule, TranslatePipe, MatRipple],
  templateUrl: './request-item.html',
  styleUrl: './request-item.css',
})
export class RequestItem {
  request = input.required<RequestEntity>();
  availableBudget = input.required<number>();
  totalBudget = input.required<number>();
  remainingDays = computed(() => {
    const difference = new Date(this.request().deadline).getTime() - Date.now();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  });
  requestedAmount = computed(() => {
    return this.request().item.quantity * this.request().item.pricePerUnit;
  });
  isAmountValid = computed(() => {
    return (this.availableBudget() + this.requestedAmount() <= this.totalBudget());
  })
}
