import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserRole } from '../models/user-role.model';

export type CurrentUser = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
};

type AuthResponse = {
  token: string;
  user: CurrentUser;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = environment.apiUrl;
  private readonly tokenKey = 'emotion_token';

  private readonly currentUserSubject = new BehaviorSubject<
    CurrentUser | null | undefined
  >(undefined);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);

    if (!token) {
      this.currentUserSubject.next(null);

      return;
    }

    this.http.get<CurrentUser>(`${this.api}/users/me`).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: () => {
        this.logout().subscribe();
      },
    });
  }

  get currentUser(): CurrentUser | null | undefined {
    return this.currentUserSubject.value;
  }

  get userId(): string | null {
    return this.currentUser?.uid ?? null;
  }

  register(email: string, password: string, name: string): Observable<unknown> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/register`, {
        email,
        password,
        displayName: name,
      })
      .pipe(
        tap((response) => {
          this.applyAuth(response);
        }),
      );
  }

  login(email: string, password: string): Observable<unknown> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.applyAuth(response);
        }),
      );
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);

    return of(undefined);
  }

  updateProfileData(name: string): Observable<void> {
    return this.http
      .put<CurrentUser>(`${this.api}/users/me`, {
        displayName: name,
      })
      .pipe(
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
        map(() => undefined),
      );
  }

  changeEmail(currentPassword: string, newEmail: string): Observable<void> {
    return this.http
      .put<AuthResponse>(`${this.api}/users/me/email`, {
        currentPassword,
        newEmail,
      })
      .pipe(
        tap((response) => {
          this.applyAuth(response);
        }),
        map(() => undefined),
      );
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<void> {
    return this.http
      .put(`${this.api}/users/me/password`, {
        currentPassword,
        newPassword,
      })
      .pipe(map(() => undefined));
  }

  private applyAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUserSubject.next(response.user);
  }
}
