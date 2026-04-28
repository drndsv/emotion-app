import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

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

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  logout() {
    return signOut(firebaseAuth);
  }
}
