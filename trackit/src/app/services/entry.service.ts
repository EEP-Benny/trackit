import { Injectable } from '@angular/core';
import { IEntry, IEntryWithId } from '../interfaces/IEntry';
import { DexieService } from './dexie.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private entries: IEntry[] = [];
  private entriesEmitter = new BehaviorSubject<IEntry[]>(this.entries);

  constructor(private dexieService: DexieService) {}

  async fetchEntriesFromDb() {
    this.entries = await this.dexieService.entries
      .orderBy('timestamp')
      .reverse()
      .toArray();
    this.entriesEmitter.next(this.entries);
  }

  async addEntry(entry: IEntry) {
    const id = await this.dexieService.entries.add(entry);
    this.entries.unshift(entry);
    this.entriesEmitter.next(this.entries);
    return id;
  }

  async updateEntry(entry: IEntryWithId) {
    const id = await this.dexieService.entries.put(entry);
    this.fetchEntriesFromDb();
    return id;
  }

  async deleteEntry(entry: IEntryWithId) {
    await this.dexieService.entries.delete(entry.id);
    const index = this.entries.findIndex((e) => e === entry);
    this.entries.splice(index, 1);
    this.entriesEmitter.next(this.entries);
  }

  getAllEntries(): Observable<IEntry[]> {
    this.fetchEntriesFromDb();
    return this.entriesEmitter.asObservable();
  }

  async getAllEntriesForExport() {
    return await this.dexieService.entries.orderBy('timestamp').toArray();
  }

  async countAllEntries() {
    return await this.dexieService.entries.count();
  }

  async clearAllEntries() {
    await this.dexieService.entries.clear();
  }

  async importEntries(entries: IEntry[]) {
    await this.dexieService.entries.bulkAdd(entries);
    this.fetchEntriesFromDb();
  }
}
