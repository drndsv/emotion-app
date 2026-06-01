import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppUser } from '../models/app-user.model';
import {
  AuthResponse,
  UpdateEmailRequest,
  UpdatePasswordRequest,
} from '../models/auth.model';

export interface UpdateProfileRequest {
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getCurrentUser(): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.apiUrl}/users/me`);
  }

  updateProfile(request: UpdateProfileRequest): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.apiUrl}/users/me`, request);
  }

  updateEmail(request: UpdateEmailRequest): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/users/me/email`, request);
  }

  updatePassword(request: UpdatePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/me/password`, request);
  }
}
