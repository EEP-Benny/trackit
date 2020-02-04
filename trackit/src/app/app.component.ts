import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IEntry, IEntryWithId } from './interfaces/IEntry';
import { EntryService } from './services/entry.service';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
          style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate('150ms cubic-bezier(0.4, 0.0, 1, 1)',
          style({
            opacity: 0, height: 0
          }))
      ])
    ]),
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(25, animateChild()))
      ]),
    ])
  ]
})
export class AppComponent implements OnInit {

  constructor(private readonly entryService: EntryService, ) {
    this.form = new FormGroup({
      value: new FormControl('', Validators.required),
      timestamp: new FormControl(new Date()),
    });
  }

  title = 'TrackIt';

  form: FormGroup;

  entries: IEntry[] = [];

  deferredPrompt: any;
  showButton = false;

  ngOnInit() {
    this.entryService.fetchAllEntries().then((entriesFromDB) => { this.entries = entriesFromDB; });
  }

  async addEntry() {
    const entry = this.form.value;
    const id = await this.entryService.addEntry(entry);
    this.entries = [{ id, ...entry }, ...this.entries];
    this.form.reset({ timestamp: new Date() });
  }

  async setToNow(entry: IEntryWithId) {
    entry.timestamp = new Date();
    await this.entryService.updateEntry(entry);
  }

  async deleteEntry(entry: IEntryWithId) {
    await this.entryService.deleteEntry(entry);
    const index = this.entries.findIndex(e => e === entry);
    this.entries.splice(index, 1);
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string; }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }
}
