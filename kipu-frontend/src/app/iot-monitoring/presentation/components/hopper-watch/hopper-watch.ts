import { Component, input } from '@angular/core';
import { HopperEntity } from '../../../domain/hopper.entity';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-hopper-watch',
  imports: [MatCard, NgClass, MatCardHeader, MatCardContent, MatCardFooter],
  templateUrl: './hopper-watch.html',
  styleUrl: './hopper-watch.css',
})
export class HopperWatch {
  hopperSensors = input.required<HopperEntity[]>();

  getSensorStatusClass(currentLecture: number, limit: number): string {
    if (currentLecture >= limit) {
      return 'status-danger';
    } else if (currentLecture >= limit - 2) {
      return 'status-warning';
    } else {
      return 'status-ok';
    }
  }

  getTicketStatusBySensor(currentLecture: number, limit: number): string {
    if (currentLecture >= limit) {
      return 'pending';
    } else if (currentLecture >= limit - 2) {
      return 'completed';
    } else {
      return 'completed';
    }
  }
}
