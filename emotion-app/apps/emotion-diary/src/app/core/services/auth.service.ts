import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
  updatePassword,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { BehaviorSubject, from, map, Observable, switchMap } from 'rxjs';

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

  register(
    email: string,
    password: string,
    name: string,
  ): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(firebaseAuth, email, password),
    ).pipe(
      switchMap((credential) =>
        from(
          updateProfile(credential.user, {
            displayName: name,
          }),
        ).pipe(map(() => credential)),
      ),
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(firebaseAuth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(firebaseAuth));
  }

  updateProfileData(name: string): Observable<void> {
    const user = this.currentUser;

    if (!user) {
      throw new Error('User is not authorized');
    }

    return from(
      updateProfile(user, {
        displayName: name,
      }),
    );
  }

  changeEmail(currentPassword: string, newEmail: string): Observable<void> {
    const user = this.currentUser;

    if (!user || !user.email) {
      throw new Error('User is not authorized');
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );

    return from(
      reauthenticateWithCredential(user, credential).then(() =>
        verifyBeforeUpdateEmail(user, newEmail),
      ),
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<void> {
    const user = this.currentUser;

    if (!user || !user.email) {
      throw new Error('User is not authorized');
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );

    return from(
      reauthenticateWithCredential(user, credential).then(() =>
        updatePassword(user, newPassword),
      ),
    );
  }
}
