import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutDialogComponent } from './logout-dialog.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  
  currentUser = signal<any>(null);

  constructor() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser.set(JSON.parse(userStr));
    }
  }

  logout() {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentProjectId');
      this.router.navigate(['/login']);
    });
  }
}
