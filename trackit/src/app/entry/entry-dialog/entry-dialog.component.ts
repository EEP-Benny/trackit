import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { EntryService } from 'src/app/services/entry.service';

interface FormEntry {
  date: Date;
  time: string;
  value: string;
}

@Component({
  selector: 'ti-entry-dialog',
  templateUrl: './entry-dialog.component.html',
  styleUrls: ['./entry-dialog.component.css'],
})
export class EntryDialogComponent implements OnInit {
  form: IFormGroup<FormEntry>;
  formBuilder: IFormBuilder;
  addAnotherControl: FormControl;

  constructor(
    private readonly entryService: EntryService,
    formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EntryDialogComponent>
  ) {
    this.formBuilder = formBuilder;
  }

  ngOnInit() {
    this.form = this.formBuilder.group<FormEntry>({
      date: [new Date(), Validators.required],
      time: [getTimeStringFromDate(new Date()), Validators.required],
      value: ['', Validators.required],
    });
    this.addAnotherControl = new FormControl(false);
  }

  async onSubmit() {
    const formValues = this.form.value;
    const value = +formValues.value;
    const timestamp = formValues.date;
    setTimeStringToDate(formValues.time, timestamp);

    if (this.addAnotherControl.value) {
      this.form.reset({ ...formValues, value: '' });
    } else {
      this.dialogRef.close();
    }
    await this.entryService.addEntry({ value, timestamp });
  }
}

const getTimeStringFromDate = (d: Date) =>
  [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((x) => x.toString().padStart(2, '0'))
    .join(':');

const setTimeStringToDate = (t: string, d: Date) => {
  const [h, m, s] = t.split(':');
  d.setHours(+h, +m, +s);
};
