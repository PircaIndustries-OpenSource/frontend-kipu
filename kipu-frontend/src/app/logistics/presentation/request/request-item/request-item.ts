import {Component, computed, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {RequestEntity} from '../../../domain/request.entity';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-request-item',
  imports: [MatCardModule, MatButton, TranslatePipe, MatRipple],
  templateUrl: './request-item.html',
  styleUrl: './request-item.css',
})
export class RequestItem {
  request = input.required<RequestEntity>();
  remainingDays = computed(()=> {
    const difference = new Date(this.request().deadline).getTime() - Date.now();
    return Math.ceil(difference /(1000 * 60 * 60 * 24));
  })
}
