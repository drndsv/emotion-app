import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
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

import { firestore } from '../firebase/firebase';
import {
  CreateJournalEntry,
  JournalEntry,
  UpdateJournalEntry,
} from '../models/journal-entry.model';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private readonly collectionName = 'journalEntries';

  getUserEntries(userId: string): Observable<JournalEntry[]> {
    const entriesQuery = query(
      collection(firestore, this.collectionName),
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
    const entryRef = doc(firestore, this.collectionName, id);

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
      addDoc(collection(firestore, this.collectionName), {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ).pipe(map((documentRef) => documentRef.id));
  }

  updateEntry(id: string, entry: UpdateJournalEntry): Observable<void> {
    const entryRef = doc(firestore, this.collectionName, id);

    return from(
      updateDoc(entryRef, {
        ...entry,
        updatedAt: serverTimestamp(),
      }),
    );
  }
}
