import {Component, inject, OnInit} from '@angular/core';
import {RequestList} from '../request-list/request-list';
import {LogisticsStore} from '../../../application/logistics.store';
import { SummaryCard } from '../../../../shared/presentation/summary-card/summary-card';
import {TranslatePipe} from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-request-page',
  imports: [RequestList, SummaryCard, TranslatePipe, MatIcon, MatRipple],
  templateUrl: './request-page.html',
  styleUrl: './request-page.css',
})
export class RequestPage implements OnInit {
  logisticsStore = inject(LogisticsStore);
  requests = this.logisticsStore.requests;
  ngOnInit() {
    this.logisticsStore.loadRequest();
  }
}
