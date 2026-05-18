import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUser } from '../models/app-user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}
  getUserById(userId: string): Observable<AppUser | null> { return this.http.get<any>(`${this.api}/users/me`).pipe(map((u)=>({uid:u.uid,email:u.email,displayName:u.displayName,role:'user'}))); }
}
