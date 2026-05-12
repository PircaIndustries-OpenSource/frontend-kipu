import { Component, inject, input, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { ConcreteEntity } from '../../../domain/concrete.entity';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { IoTMonitoringStore } from '../../../application/iot-monitoring.store';

@Component({
  selector: 'app-concrete-curing',
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardFooter, MatButton, NgClass],
  templateUrl: './concrete-curing.html',
  styleUrl: './concrete-curing.css',
})
export class ConcreteCuring implements OnInit {
  //concreteSensors = input.required<ConcreteEntity[]>();
  private store = inject(IoTMonitoringStore);
  //input.required<HopperEntity[]>();
  concreteSensors = this.store.concreteSensors;

  ngOnInit(): void {
    if (this.concreteSensors().length === 0) {
      this.store.loadConcreteSensors();
    }
  }
  getSensorStatusClass(currentTemp: number, limit: number): string {
    if (currentTemp >= limit) {
      return 'status-danger';
    } else if (currentTemp >= limit - 2) {
      return 'status-warning';
    } else {
      return 'status-ok';
    }
  }
}
