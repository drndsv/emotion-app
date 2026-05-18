import { Injectable } from '@angular/core';
import { getFirestoreInstance } from '@emotion-app/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

import {
  CreateJournalEntry,
  JournalEntry,
  UpdateJournalEntry,
} from '../models/journal-entry.model';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private readonly firestore = getFirestoreInstance();

  private readonly collectionName = 'journalEntries' as const;

  getUserEntries(userId: string): Observable<JournalEntry[]> {
    const entriesQuery = query(
      collection(this.firestore, this.collectionName),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );

    return from(getDocs(entriesQuery)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (document) =>
            ({
              id: document.id,
              ...document.data(),
            }) as JournalEntry,
        ),
      ),
    );
  }

  getEntryById(id: string): Observable<JournalEntry | null> {
    const entryRef = doc(this.firestore, this.collectionName, id);

    return from(getDoc(entryRef)).pipe(
      map((snapshot) => {
        if (!snapshot.exists()) {
          return null;
        }

        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as JournalEntry;
      }),
    );
  }

  createEntry(entry: CreateJournalEntry): Observable<string> {
    return from(
      addDoc(collection(this.firestore, this.collectionName), {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ).pipe(map((documentRef) => documentRef.id));
  }

  updateEntry(id: string, entry: UpdateJournalEntry): Observable<void> {
    const entryRef = doc(this.firestore, this.collectionName, id);

    return from(
      updateDoc(entryRef, {
        ...entry,
        updatedAt: serverTimestamp(),
      }),
    );
  }

  deleteEntry(id: string): Observable<void> {
    const entryRef = doc(this.firestore, this.collectionName, id);

    return from(deleteDoc(entryRef));
  }
}
