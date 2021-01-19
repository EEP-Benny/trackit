import { Component, OnInit } from '@angular/core';
import { IEntry, IEntryWithId } from 'src/app/interfaces/IEntry';
import { EntryService } from 'src/app/services/entry.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  animateChild,
} from '@angular/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'ti-entrieslist',
  templateUrl: './entrieslist.component.html',
  styleUrls: ['./entrieslist.component.css'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate(
          '250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({ opacity: 1, height: '*' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate(
          '150ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({
            opacity: 0,
            height: 0,
          })
        ),
      ]),
    ]),
    trigger('list', [
      transition(':enter', [
        query(
          '@items',
          [
            style({ opacity: 0, transform: 'translateY(25px)' }),
            stagger(25, [
              animate(
                '350ms cubic-bezier(0.0, 0.0, 0.2, 1)',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class EntrieslistComponent implements OnInit {
  entries$: Observable<IEntry[]>;

  trackByIdFn = (_: number, entry: IEntryWithId) => entry.id;

  constructor(private readonly entryService: EntryService) {}

  ngOnInit() {
    this.entries$ = this.entryService.getAllEntries();
  }

  setToNow(entry: IEntryWithId) {
    this.entryService.updateEntry({ ...entry, timestamp: new Date() });
  }

  deleteEntry(entry: IEntryWithId) {
    this.entryService.deleteEntry(entry);
  }
}
