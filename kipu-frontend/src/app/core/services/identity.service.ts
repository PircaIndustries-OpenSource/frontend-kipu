import { email } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { Identity } from './identity.model';


  @Injectable({ providedIn: 'root' })
  export class IdentityService {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:3000/identity';

    /**
     * Check if an email already exists
     * @param email
     * @returns
     * */

    checkEmailExists(email: string): Observable<boolean> {
      return this.http
        .get<Identity[]>(`${this.apiUrl}?email=${email}`)
        .pipe(map((users) => users.length > 0));
    }

    /**
     * Register a new user
     * @param data
     * @returns
     * */

    registerData(data: Identity): Observable<Identity> {
      return this.http.post<Identity>(`${this.apiUrl}`, data);
    }
  }

