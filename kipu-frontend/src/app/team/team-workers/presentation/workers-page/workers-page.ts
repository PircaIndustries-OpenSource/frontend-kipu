import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { TeamWorkersStore } from '../../application/team-workers.store';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkersAddWorker } from '../workers-add-worker/workers-add-worker';

@Component({
  selector: 'app-workers-page',
  imports: [TranslatePipe, MatRipple, MatDialogModule],
  templateUrl: './workers-page.html',
  styleUrl: './workers-page.css',
})
export class WorkersPage implements OnInit {
  teamStore: TeamWorkersStore = inject(TeamWorkersStore);
  dialog = inject(MatDialog);

  openFormDialog() {
    const dialogRef = this.dialog.open(WorkersAddWorker, {
      width: "500px",
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.onSaveWorker(result);
      }
    })
  }

  onSaveWorker(workerData: any){
    const workerDTO = {
      ...workerData,
      id: `w-${Date.now()}`
    }
    this.teamStore.addWorker(workerDTO);
  }

  ngOnInit(): void {
    this.teamStore.loadWorkers();
  }

  deleteWorker(id: string){
    this.teamStore.deleteWorker(id);
  }

}
