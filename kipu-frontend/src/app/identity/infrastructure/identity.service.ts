import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, of, switchMap, catchError } from 'rxjs';
import { Identity } from '../domain/identity.model';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class IdentityService {
  private http = inject(HttpClient);

  private apiUrl = environment.kipuApiBaseUrl + '/identity';
  private authUrl = environment.kipuApiBaseUrl + '/auth';

  /**
   * Check if an email already exists.
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<Identity[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map((users) => users.length > 0));
  }

  /**
   * Fetch an existing user by email.
   */
  getIdentityByEmail(email: string): Observable<Identity | null> {
    return this.http
      .get<Identity[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map((users) => (users.length > 0 ? users[0] : null)));
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

  loginWithJwt(email: string, password: string): Observable<AuthResponse | null> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, { email, password })
      .pipe(catchError(() => of(null)));
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

  generateOtp(email: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/otp/generate`, { email }, { observe: 'response' })
      .pipe(map(response => response.status === 200));
  }

  validateOtp(email: string, code: string): Observable<boolean> {
    return this.http.post<{valid: boolean}>(`${this.apiUrl}/otp/validate`, { email, code })
      .pipe(map(response => response.valid));
  }
}

