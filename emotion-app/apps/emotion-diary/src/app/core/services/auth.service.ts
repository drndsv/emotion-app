import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  CurrentUser,
  UpdateEmailRequest,
  UpdatePasswordRequest,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly api = environment.apiUrl;
  private readonly tokenKey = 'emotion_token';
  private readonly currentUserSubject = new BehaviorSubject<
    CurrentUser | null | undefined
  >(undefined);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem(this.tokenKey);

    if (token === null) {
      this.currentUserSubject.next(null);

      return;
    }

    this.refreshCurrentUser().subscribe({
      error: () => {
        this.clearAuthState();
      },
    });
  }

  get currentUser(): CurrentUser | null | undefined {
    return this.currentUserSubject.value;
  }

  get userId(): string | null {
    return this.currentUser?.uid ?? null;
  }

  register(
    email: string,
    password: string,
    name: string,
  ): Observable<CurrentUser> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/register`, {
        email,
        password,
        displayName: name,
      })
      .pipe(
        tap((response) => this.applyAuth(response)),
        map((response) => response.user),
      );
  }

  login(email: string, password: string): Observable<CurrentUser> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, { email, password })
      .pipe(
        tap((response) => this.applyAuth(response)),
        map((response) => response.user),
      );
  }

  logout(): Observable<void> {
    this.clearAuthState();

    return of(undefined);
  }

  refreshCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.api}/users/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      }),
    );
  }

  updateProfileData(name: string): Observable<void> {
    return this.http
      .put<CurrentUser>(`${this.api}/users/me`, { displayName: name })
      .pipe(
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
        map(() => undefined),
      );
  }

  changeEmail(
    currentPassword: string,
    newEmail: string,
  ): Observable<CurrentUser> {
    return this.http
      .put<AuthResponse>(`${this.api}/users/me/email`, {
        currentPassword,
        newEmail,
      } satisfies UpdateEmailRequest)
      .pipe(
        tap((response) => this.applyAuth(response)),
        map((response) => response.user),
      );
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<void> {
    return this.http
      .put<void>(`${this.api}/users/me/password`, {
        currentPassword,
        newPassword,
      } satisfies UpdatePasswordRequest)
      .pipe(map(() => undefined));
  }

  private applyAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUserSubject.next(response.user);
  }

  private clearAuthState(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }
}
