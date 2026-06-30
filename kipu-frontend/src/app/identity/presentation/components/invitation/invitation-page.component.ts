import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamUsersApi } from '../../../../team/team-users/infrastructure/team-users.api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invitation-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4 text-center">Invitación a Proyecto</h2>
        
        <div *ngIf="loading" class="text-center text-gray-500">
          Procesando...
        </div>
        
        <div *ngIf="!loading && !processed" class="text-center">
          <p class="mb-6">Has sido invitado a participar en el proyecto.</p>
          <div class="flex justify-center gap-4">
            <button (click)="accept()" class="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Aceptar</button>
            <button (click)="reject()" class="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Rechazar</button>
          </div>
        </div>

        <div *ngIf="processed" class="text-center">
          <p class="mb-4 text-lg font-semibold">{{ message }}</p>
          <button (click)="goHome()" class="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">Ir al inicio</button>
        </div>
      </div>
    </div>
  `
})
export class InvitationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamApi = inject(TeamUsersApi);

  invitationId: number = 0;
  loading = false;
  processed = false;
  message = '';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.invitationId = parseInt(idParam, 10);
    }
  }

  accept() {
    this.loading = true;
    this.teamApi.acceptInvitation(this.invitationId).subscribe({
      next: () => {
        this.loading = false;
        this.processed = true;
        this.message = '¡Has aceptado la invitación!';
      },
      error: () => {
        this.loading = false;
        this.processed = true;
        this.message = 'Error al aceptar la invitación.';
      }
    });
  }

  reject() {
    const confirmReject = confirm("¿Estás seguro de que quieres rechazar la invitación? Esta acción no se podrá deshacer.");
    if (confirmReject) {
      this.loading = true;
      this.teamApi.rejectInvitation(this.invitationId).subscribe({
        next: () => {
          this.loading = false;
          this.processed = true;
          this.message = 'Has rechazado la invitación.';
        },
        error: () => {
          this.loading = false;
          this.processed = true;
          this.message = 'Error al rechazar la invitación.';
        }
      });
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
