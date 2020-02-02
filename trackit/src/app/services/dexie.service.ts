import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { IEntry } from '../interfaces/IEntry';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  entries: Dexie.Table<IEntry, number>;

  constructor() {
    super('TrackItDatabase');

    //
    // Define tables and indexes
    // (Here's where the implicit table props are dynamically created)
    //
    this.version(1).stores({
      entries: '++id, timestamp, value',
    });

    // The following lines are needed for it to work across typescipt using babel-preset-typescript:
    this.entries = this.table('entries');
  }
}

