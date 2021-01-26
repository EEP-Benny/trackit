import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { EntryService } from 'src/app/services/entry.service';

interface FormEntry {
  date: Date;
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
      value: ['', Validators.required],
    });
    this.addAnotherControl = new FormControl(false);
  }

  async onSubmit() {
    const formValue = this.form.value;
    if (this.addAnotherControl.value) {
      this.form.reset({ ...formValue, value: '' });
    } else {
      this.dialogRef.close();
    }
    await this.entryService.addEntry({
      value: +formValue.value,
      timestamp: formValue.date,
    });
  }
}
