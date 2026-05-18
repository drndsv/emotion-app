import { Injectable } from '@angular/core';
import { getFirestoreInstance } from '@emotion-app/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

import { USERS_COLLECTION } from '../constants/users';
import { AppUser } from '../models/app-user.model';
import { DEFAULT_USER_ROLE } from '../models/user-role.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly firestore = getFirestoreInstance();

  getUserById(userId: string): Observable<AppUser | null> {
    return from(getDoc(doc(this.firestore, USERS_COLLECTION, userId))).pipe(
      map((snapshot) => {
        if (!snapshot.exists()) {
          return null;
        }

        const data = snapshot.data();

        return {
          uid: userId,
          email: data['email'] ?? null,
          displayName: data['displayName'] ?? null,
          role: data['role'] ?? DEFAULT_USER_ROLE,
        };
      }),
    );
  }
}
