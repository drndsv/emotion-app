import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateJournalEntry, JournalEntry, UpdateJournalEntry } from '../models/journal-entry.model';

@Injectable({ providedIn: 'root' })
export class JournalService {
  private readonly api = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}
  getUserEntries(userId: string): Observable<JournalEntry[]> { return this.http.get<JournalEntry[]>(`${this.api}/journal`); }
  getEntryById(id: string): Observable<JournalEntry | null> { return this.http.get<JournalEntry>(`${this.api}/journal/${id}`); }
  createEntry(entry: CreateJournalEntry): Observable<string> { return this.http.post<JournalEntry>(`${this.api}/journal`, entry).pipe(map((e) => e.id)); }
  updateEntry(id: string, entry: UpdateJournalEntry): Observable<void> { return this.http.put(`${this.api}/journal/${id}`, entry).pipe(map(() => undefined)); }
  deleteEntry(id: string): Observable<void> { return this.http.delete(`${this.api}/journal/${id}`).pipe(map(() => undefined)); }
}
