import { Component, inject, input, OnInit } from '@angular/core';
import { HopperEntity } from '../../../domain/hopper.entity';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { IoTMonitoringStore } from '../../../application/iot-monitoring.store';

@Component({
  selector: 'app-hopper-watch',
  imports: [MatCard, NgClass, MatCardHeader, MatCardContent, MatCardFooter],
  templateUrl: './hopper-watch.html',
  styleUrl: './hopper-watch.css',
})
export class HopperWatch implements OnInit {
  private store = inject(IoTMonitoringStore);
  //input.required<HopperEntity[]>();
  hopperSensors = this.store.hopperSensors;

  ngOnInit(): void {
    if (this.hopperSensors().length === 0) {
      this.store.loadHopperSensors();

    }
  }

  getSensorStatusClass(currentLecture: number, limit: number): string {
    if (currentLecture < limit) {
      return 'status-danger';
    } else if (currentLecture >= limit && currentLecture <= limit - 2) {
      return 'status-warning';
    } else {
      return 'status-ok';
    }
  }

  getTicketStatusBySensor(currentLecture: number, limit: number): string {
    if (currentLecture < limit) {
      return 'pending';
    } else if (currentLecture >= limit && currentLecture <= limit - 2) {
      return 'completed';
    } else {
      return 'completed';
    }
  }
}
