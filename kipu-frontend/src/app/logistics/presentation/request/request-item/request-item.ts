import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RequestViewModel } from '../../../domain/request.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-request-item',
  imports: [MatCardModule, TranslatePipe, MatRipple],
  templateUrl: './request-item.html',
  styleUrl: './request-item.css',
})
export class RequestItem {
  request = input.required<RequestViewModel>();
  availableBudget = input.required<number>();
  totalBudget = input.required<number>();
  remainingDays = computed(() => {
    const difference = new Date(this.request().deadline).getTime() - Date.now();
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  });
  requestedAmount = computed(() => {
      return this.request().items.reduce((total, item) => {
        return total + Math.ceil(item.quantity * item.pricePerUnit);
      }, 0);
  });
  isAmountValid = computed(() => {
    return (this.availableBudget() + this.requestedAmount() <= this.totalBudget());
  })
}
