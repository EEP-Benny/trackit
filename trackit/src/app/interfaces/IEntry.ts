export interface IEntry {
  timestamp: Date;
  value: number;
}

export interface IEntryWithId extends IEntry {
  id: number;
}
