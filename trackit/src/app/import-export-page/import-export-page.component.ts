import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEntry } from '../interfaces/IEntry';
import { csvFormat, csvParseRows } from 'd3-dsv';
import { EntryService } from '../services/entry.service';

type ExportInfo = {
  date: Date;
  entryCount: number;
  fileSize: number;
  blobUrl: SafeUrl;
};
type ImportData = { entries: IEntry[]; filename: string };

@Component({
  selector: 'ti-import-export-page',
  templateUrl: './import-export-page.component.html',
  styleUrls: ['./import-export-page.component.css'],
})
export class ImportExportPageComponent implements OnInit {
  @ViewChild('exportDialog')
  exportDialogTemplate: TemplateRef<any>;

  @ViewChild('importSuccessSnackBar')
  importSuccessSnackBarTemplate: TemplateRef<any>;

  exportInfo: ExportInfo = null;

  importData: ImportData;

  constructor(
    private readonly entryService: EntryService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  async generateExport() {
    const dialog = this.dialog.open(this.exportDialogTemplate, {
      width: '400px',
    });

    const entries = await this.entryService.getAllEntriesForExport();
    const csvContent = csvFormat(entries, ['timestamp', 'value']);
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    this.exportInfo = {
      date: new Date(),
      entryCount: entries.length,
      fileSize: csvBlob.size,
      blobUrl: this.sanitizer.bypassSecurityTrustUrl(url),
    };
    const onClose = () => {
      URL.revokeObjectURL(url);
      this.exportInfo = null;
    };
    if (dialog.getState() === MatDialogState.OPEN) {
      dialog.afterClosed().subscribe(onClose);
    } else {
      onClose();
    }
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
      await this.entryService.clearAllEntries();
    }
    await this.entryService.importEntries(this.importData.entries);
    this.snackBar.openFromTemplate(this.importSuccessSnackBarTemplate, {
      duration: 3000,
    });
  }
}
