import { Injectable } from '@angular/core';
import { IEntry } from '../interfaces/IEntry';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor() { }

  private entries: IEntry[] = [];

  addEntry(entry: IEntry) {
    entry.timestamp = new Date();
    this.entries.unshift(entry);
  }

  getAllEntries() {
    return this.entries;
  }
}


