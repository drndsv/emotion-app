import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateJournalEntry, JournalEntry, UpdateJournalEntry } from '../models/journal-entry.model';

type BackendJournalEntry = {
  id: number;
  userId: number;
  text: string;
  selectedEmotion: string;
  detectedEmotion: string;
  finalEmotion: string;
  analysis: string;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
};

@Injectable({ providedIn: 'root' })
export class JournalService {
  private readonly api = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  getUserEntries(userId: string): Observable<JournalEntry[]> {
    return this.http
      .get<BackendJournalEntry[]>(`${this.api}/journal`)
      .pipe(map((entries) => entries.map((e) => this.mapFromBackend(e))));
  }

  getEntryById(id: string): Observable<JournalEntry | null> {
    return this.http
      .get<BackendJournalEntry>(`${this.api}/journal/${id}`)
      .pipe(map((e) => this.mapFromBackend(e)));
  }

  createEntry(entry: CreateJournalEntry): Observable<string> {
    return this.http
      .post<BackendJournalEntry>(`${this.api}/journal`, this.mapToBackend(entry))
      .pipe(map((e) => String(e.id)));
  }

  updateEntry(id: string, entry: UpdateJournalEntry): Observable<void> {
    return this.http
      .put(`${this.api}/journal/${id}`, this.mapToBackend(entry))
      .pipe(map(() => undefined));
  }

  deleteEntry(id: string): Observable<void> {
    return this.http.delete(`${this.api}/journal/${id}`).pipe(map(() => undefined));
  }

  private mapFromBackend(entry: BackendJournalEntry): JournalEntry {
    return {
      id: String(entry.id),
      userId: String(entry.userId),
      text: entry.text,
      selectedState: (entry.selectedEmotion ?? 'neutral') as JournalEntry['selectedState'],
      detectedState: (entry.detectedEmotion ?? 'neutral') as JournalEntry['detectedState'],
      finalState: (entry.finalEmotion ?? 'neutral') as JournalEntry['finalState'],
      analysis: entry.analysis ?? '',
      recommendation: entry.recommendation ?? '',
      createdAt: entry.createdAt as unknown as JournalEntry['createdAt'],
      updatedAt: entry.updatedAt as unknown as JournalEntry['updatedAt'],
    };
  }

  private mapToBackend(entry: Partial<JournalEntry>) {
    return {
      text: entry.text ?? '',
      selectedEmotion: entry.selectedState ?? 'neutral',
      detectedEmotion: entry.detectedState ?? 'unknown',
      finalEmotion: entry.finalState ?? entry.selectedState ?? 'neutral',
      analysis: entry.analysis ?? '',
      recommendation: entry.recommendation ?? '',
    };
  }
}
