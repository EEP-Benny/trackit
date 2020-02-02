import { Injectable } from '@angular/core';
import { IEntry, IEntryWithId } from '../interfaces/IEntry';
import { DexieService } from './dexie.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private dexieService: DexieService) { }

  addEntry(entry: IEntry) {
    entry.timestamp = new Date();
    return this.dexieService.entries.add(entry);
  }

  updateEntry(entry: IEntryWithId) {
    return this.dexieService.entries.put(entry);
  }

  deleteEntry(entry: IEntryWithId) {
    return this.dexieService.entries.delete(entry.id);
  }

  fetchAllEntries() {
    return this.dexieService.entries.orderBy('timestamp').reverse().toArray();
  }
}


