import {Component, inject, OnInit} from '@angular/core';
import {RequestList} from '../request-list/request-list';
import {LogisticsStore} from '../../../application/logistics.store';
@Component({
  selector: 'app-request-page',
  imports: [RequestList],
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
