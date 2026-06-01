import { Component, inject, input, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader } from '@angular/material/card';
import { NgClass } from '@angular/common';
import { HopperStore } from '../../../application/hopper.store';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AddHopperWatchDialogComponent } from '../../forms/hopper-watch/add-hopper-watch-dialog-component/add-hopper-watch-dialog-component';
import { EditHopperWatchDialogComponent } from '../../forms/hopper-watch/edit-hopper-watch-dialog-component/edit-hopper-watch-dialog-component';
import { HopperEntity } from '../../../domain/hopper.entity';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-hopper-watch',
  imports: [
    MatCard,
    NgClass,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './hopper-watch.html',
  styleUrl: './hopper-watch.css',
})
export class HopperWatch implements OnInit {
  constructor(private dialog: MatDialog) {}

  private store = inject(HopperStore);
  //input.required<HopperEntity[]>();
  hopperSensors = this.store.hopperSensors;

  ngOnInit(): void {
    if (this.hopperSensors().length === 0) {
      this.store.loadHopperSensors();
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddHopperWatchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Resultado del diálogo:', result); // Revisa esto en la consola (F12)
      if (result) {
        this.store.addHopperSensor(result);
      }
    });
  }

  openEditDialog(sensor: HopperEntity) {
    const dialogRef = this.dialog.open(EditHopperWatchDialogComponent, {
      data: sensor,
    });

    dialogRef.afterClosed().subscribe((result: HopperEntity) => {
      if (result) {
        this.store.updateHopperSensor(result);
      }
    });
  }

  onDelete(sensor: HopperEntity): void {
    if (confirm('Eliminar?')) {
      this.store.eraseHopperSensor(sensor.id);
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
