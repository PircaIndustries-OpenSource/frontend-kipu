import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
        
        <div *ngIf="loading && !invitation" class="text-center text-gray-500">
          Cargando...
        </div>

        <div *ngIf="invitation && !loading && !processed" class="text-center">
          <p class="mb-2 text-lg font-semibold">{{ invitation.projectName || 'Proyecto' }}</p>
          <p class="mb-4 text-gray-600">
            {{ invitation.invitedBy || 'Alguien' }} te ha invitado con el rol:
            <span class="font-bold">{{ invitation.role }}</span>
          </p>
          <div class="flex justify-center gap-4">
            <button (click)="accept()" class="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Aceptar</button>
            <button (click)="reject()" class="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Rechazar</button>
          </div>
        </div>

        <div *ngIf="loading && invitation" class="text-center text-gray-500">
          Procesando...
        </div>

        <div *ngIf="processed" class="text-center">
          <p class="mb-4 text-lg font-semibold">{{ message }}</p>
        </div>
      </div>
    </div>
  `
})
export class InvitationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamApi = inject(TeamUsersApi);
  private cdr = inject(ChangeDetectorRef);

  invitationId: number = 0;
  invitation: any = null;
  loading = false;
  processed = false;
  message = '';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.invitationId = parseInt(idParam, 10);
      this.loadInvitation();
    }
  }

  loadInvitation() {
    this.loading = true;
    this.cdr.detectChanges();
    this.teamApi.getInvitationById(this.invitationId).subscribe({
      next: (inv) => {
        this.invitation = inv;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.message = 'No se pudo cargar la invitación.';
        this.processed = true;
        this.cdr.detectChanges();
      }
    });
  }

  accept() {
    this.loading = true;
    this.cdr.detectChanges();
    this.teamApi.acceptInvitation(this.invitationId).subscribe({
      next: () => {
        this.loading = false;
        this.processed = true;
        this.message = '¡Has aceptado la invitación! Redirigiendo...';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/projects']), 1500);
      },
      error: () => {
        this.loading = false;
        this.processed = true;
        this.message = 'Error al aceptar la invitación.';
        this.cdr.detectChanges();
      }
    });
  }

  reject() {
    const confirmReject = confirm("¿Estás seguro de que quieres rechazar la invitación? Esta acción no se podrá deshacer.");
    if (confirmReject) {
      this.loading = true;
      this.cdr.detectChanges();
      this.teamApi.rejectInvitation(this.invitationId).subscribe({
        next: () => {
          this.loading = false;
          this.processed = true;
          this.message = 'Has rechazado la invitación.';
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: () => {
          this.loading = false;
          this.processed = true;
          this.message = 'Error al rechazar la invitación.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
