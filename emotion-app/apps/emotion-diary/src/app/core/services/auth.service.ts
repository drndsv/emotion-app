import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { firebaseAuth } from '../firebase/firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<
    User | null | undefined
  >(undefined);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  get currentUser(): User | null | undefined {
    return this.currentUserSubject.value;
  }

  get userId(): string | null {
    return this.currentUser?.uid ?? null;
  }

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(firebaseAuth, email, password));
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(firebaseAuth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(firebaseAuth));
  }
}
