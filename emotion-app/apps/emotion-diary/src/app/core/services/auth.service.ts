import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export type CurrentUser = { uid: string; email: string; displayName: string };

type AuthResponse = { token: string; user: { uid: string; email: string; displayName: string } };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;
  private readonly tokenKey = 'emotion_token';
  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null | undefined>(undefined);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) { this.currentUserSubject.next(null); return; }
    this.http.get<CurrentUser>(`${this.api}/users/me`).subscribe({ next: (user) => this.currentUserSubject.next(user), error: () => this.logout().subscribe() });
  }
  get currentUser(){ return this.currentUserSubject.value; }
  get userId(){ return this.currentUser?.uid ?? null; }
  register(email:string,password:string,name:string): Observable<unknown>{ return this.http.post<AuthResponse>(`${this.api}/auth/register`,{email,password,displayName:name}).pipe(tap((r)=>this.applyAuth(r))); }
  login(email:string,password:string): Observable<unknown>{ return this.http.post<AuthResponse>(`${this.api}/auth/login`,{email,password}).pipe(tap((r)=>this.applyAuth(r))); }
  logout(): Observable<void>{ localStorage.removeItem(this.tokenKey); this.currentUserSubject.next(null); return new BehaviorSubject<void>(undefined).pipe(map(()=>undefined)); }
  updateProfileData(name:string){ return this.http.put<CurrentUser>(`${this.api}/users/me`,{displayName:name}).pipe(tap((u)=>this.currentUserSubject.next(u)), map(()=>undefined)); }
  changeEmail(currentPassword: string, newEmail: string){ return this.http.put(`/users/me`,{displayName:this.currentUser?.displayName ?? ""}).pipe(map(()=>undefined)); }
  changePassword(currentPassword: string, newPassword: string){ return this.http.put(`/users/me`,{displayName:this.currentUser?.displayName ?? ""}).pipe(map(()=>undefined)); }
  private applyAuth(resp:AuthResponse){ localStorage.setItem(this.tokenKey,resp.token); this.currentUserSubject.next(resp.user); }
}
