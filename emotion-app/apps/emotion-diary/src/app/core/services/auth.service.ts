import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { from, Observable } from 'rxjs';

import { firebaseAuth } from '../firebase/firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserValue: User | null = null;

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUserValue = user;
    });
  }

  get currentUser(): User | null {
    return this.currentUserValue;
  }

  get userId(): string | null {
    return this.currentUserValue?.uid ?? null;
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
