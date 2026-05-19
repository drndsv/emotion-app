import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppUser } from '../models/app-user.model';
import { UserRole } from '../models/user-role.model';

type BackendUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: UserRole;
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getUserById(): Observable<AppUser | null> {
    return this.http.get<BackendUser>(`${this.api}/users/me`).pipe(
      map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role ?? 'user',
      })),
    );
  }
}
