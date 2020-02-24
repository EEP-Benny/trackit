import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntryService } from 'src/app/services/entry.service';

@Component({
  selector: 'ti-entryform',
  templateUrl: './entryform.component.html',
  styleUrls: ['./entryform.component.css']
})
export class EntryformComponent implements OnInit {

  constructor(private readonly entryService: EntryService) { }

  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      value: new FormControl('', Validators.required),
      timestamp: new FormControl(new Date()),
    });
  }

  async addEntry() {
    const entry = this.form.value;
    const id = await this.entryService.addEntry(entry);
    this.form.reset({ timestamp: new Date() });
  }



}
