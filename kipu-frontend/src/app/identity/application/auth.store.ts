import { computed, Injectable, signal } from '@angular/core';
import { Identity } from '../domain/identity.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly currentUserSignal = signal<Identity | null>(null);
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly userName = computed(() => this.currentUser()?.name ?? '');
  readonly userId = computed(() => this.currentUser()?.id ?? '');
  readonly token = computed(() => this.currentUser()?.token ?? '');

  constructor() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      this.currentUserSignal.set(user);
    }
  }
  login(user: Identity) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }
}
