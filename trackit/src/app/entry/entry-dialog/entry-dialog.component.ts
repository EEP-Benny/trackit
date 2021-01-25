import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EntryService } from 'src/app/services/entry.service';

@Component({
  selector: 'ti-entry-dialog',
  templateUrl: './entry-dialog.component.html',
  styleUrls: ['./entry-dialog.component.css'],
})
export class EntryDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly entryService: EntryService,
    private dialogRef: MatDialogRef<EntryDialogComponent>
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      value: new FormControl('', Validators.required),
      timestamp: new FormControl(new Date()),
    });
  }

  async onSubmit() {
    const formValue = this.form.value;
    this.dialogRef.close();
    await this.entryService.addEntry({
      value: +formValue.value,
      timestamp: formValue.timestamp,
    });
  }
}
