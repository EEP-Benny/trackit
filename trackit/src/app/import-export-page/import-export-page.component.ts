import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEntry } from '../interfaces/IEntry';
import { saveAs } from 'file-saver';
import { csvFormat, csvParseRows } from 'd3-dsv';
import { DexieService } from '../services/dexie.service';
import { EntryService } from '../services/entry.service';

type ExportData = { entries: IEntry[]; date: Date };
type ImportData = { entries: IEntry[]; filename: string };

@Component({
  selector: 'ti-import-export-page',
  templateUrl: './import-export-page.component.html',
  styleUrls: ['./import-export-page.component.css'],
})
export class ImportExportPageComponent implements OnInit {
  @ViewChild('importSuccessSnackBar')
  importSuccessSnackBarTemplate: TemplateRef<any>;

  exportData: ExportData;

  importData: ImportData;

  constructor(
    private readonly dexieService: DexieService,
    private readonly entryService: EntryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  async generateExport() {
    this.exportData = {
      entries: await this.dexieService.entries.orderBy('timestamp').toArray(),
      date: new Date(),
    };
  }

  downloadExport(exportData: ExportData, filename: string) {
    const csvContent = csvFormat(exportData.entries, ['timestamp', 'value']);
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(csvBlob, filename);
  }

  async uploadFile(file?: File) {
    if (!file) {
      return;
    }
    this.importData = {
      filename: file.name,
      entries: await this.readEntriesFromFile(file),
    };
  }

  async readEntriesFromFile(file: File) {
    const csvContent = await file.text();
    const csvRows = csvParseRows(csvContent);
    const headerRow = csvRows.shift(); // gets the first row and removes it from the array
    const timestampIndex = headerRow.indexOf('timestamp');
    const valueIndex = headerRow.indexOf('value');
    if (timestampIndex < 0 || valueIndex < 0) {
      return; // some columns are missing
    }
    const entries: IEntry[] = csvRows
      .map((row) => ({
        timestamp: new Date(row[timestampIndex]),
        value: +row[valueIndex],
      }))
      .filter((entry) => isFinite(entry.value));
    return entries;
  }

  async import(overwrite: boolean) {
    if (overwrite) {
      // TODO: Add confirmation dialog
      await this.dexieService.entries.clear();
    }
    await this.dexieService.entries.bulkAdd(this.importData.entries);
    this.entryService.fetchEntriesFromDb();
    this.snackBar.openFromTemplate(this.importSuccessSnackBarTemplate, {
      duration: 3000,
    });
  }
}
