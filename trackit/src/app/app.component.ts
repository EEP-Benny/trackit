import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IEntry } from './interfaces/IEntry';
import { EntryService } from './services/entry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    this.entries = this.entryService.getAllEntries();
  }

  addEntry() {
    console.log(this.form.value);
    this.entryService.addEntry(this.form.value);
    this.form.reset({ timestamp: new Date() });
  }

  setToNow(entry: IEntry) {
    entry.timestamp = new Date();
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
