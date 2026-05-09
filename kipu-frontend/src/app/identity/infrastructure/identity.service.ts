import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { Identity } from '../domain/identity.model';

@Injectable({ providedIn: 'root' })
export class IdentityService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/identity';

  /**
   * Check if an email already exists.
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<Identity[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }

  /**
   * Register a new user.
   */
  registerData(data: Identity): Observable<Identity> {
    return this.http.post<Identity>(`${this.apiUrl}`, data);
  }

  login(email: string, password: string): Observable<Identity | null> {
    return this.http
      .get<Identity[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(map((users) => (users.length > 0 ? users[0] : null)));
  }

  requestPasswordReset(email: string): Observable<boolean> {
    return this.http
      .get<Identity[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }

  resetPassword(email: string, newPassword: string): Observable<boolean> {
    return this.http.get<Identity[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap((users) => {
        if (!users.length) {
          return of(false);
        }

        const user = users[0];
        return this.http
          .patch<Identity>(`${this.apiUrl}/${user.id}`, { password: newPassword })
          .pipe(map(() => true));
      }),
    );
  }
}

