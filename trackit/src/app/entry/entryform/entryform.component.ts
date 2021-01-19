import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntryService } from 'src/app/services/entry.service';

@Component({
  selector: 'ti-entryform',
  templateUrl: './entryform.component.html',
  styleUrls: ['./entryform.component.css'],
})
export class EntryformComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly entryService: EntryService) {}

  ngOnInit() {
    this.form = new FormGroup({
      value: new FormControl(''),
    });
  }

  async addEntry() {
    const inputValue: string = this.form.value.value;
    if (inputValue) {
      this.form.reset();
      await this.entryService.addEntry({
        value: +inputValue,
        timestamp: new Date(),
      });
    }
  }
}
