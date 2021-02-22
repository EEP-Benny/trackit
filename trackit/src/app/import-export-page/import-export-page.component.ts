import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEntry } from '../interfaces/IEntry';
import { csvFormat, csvParseRows } from 'd3-dsv';
import { EntryService } from '../services/entry.service';

const getTextFromFile = (file: File) => {
  if (file.text) {
    return file.text();
  }
  // fallback for Edge and other browsers not supporting file.text()
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result as string);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsText(file);
  });
};

type ExportInfo = {
  date: Date;
  entryCount: number;
  fileSize: number;
  blobUrl: SafeUrl;
};
type ImportInfo = {
  entries: IEntry[];
  entryCount: number;
  existingEntryCount: number;
  minDate: Date;
  maxDate: Date;
};

@Component({
  selector: 'ti-import-export-page',
  templateUrl: './import-export-page.component.html',
  styleUrls: ['./import-export-page.component.scss'],
})
export class ImportExportPageComponent implements OnInit {
  @ViewChild('exportDialog')
  exportDialogTemplate: TemplateRef<any>;

  @ViewChild('importDialog')
  importDialogTemplate: TemplateRef<any>;

  @ViewChild('importConfirmReplaceDialog')
  importConfirmReplaceDialogTemplate: TemplateRef<any>;

  @ViewChild('importSuccessSnackBar')
  importSuccessSnackBarTemplate: TemplateRef<any>;

  exportInfo: ExportInfo = null;

  importDialogRef: MatDialogRef<unknown, unknown>;

  importFilename: string;

  importError: string;

  importInfo: ImportInfo = null;

  importShouldReplaceEntries: boolean;

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

  async prepareImport(file?: File) {
    if (!file) {
      return;
    }
    this.importShouldReplaceEntries = false;
    this.importFilename = file.name;
    this.importDialogRef = this.dialog.open(this.importDialogTemplate, {
      width: '400px',
    });
    const entriesPromise = this.readEntriesFromFile(file);
    const existingEntryCountPromise = this.entryService.countAllEntries();

    try {
      const [entries, existingEntryCount] = await Promise.all([
        entriesPromise,
        existingEntryCountPromise,
      ]);

      let minDate = entries[0].timestamp;
      let maxDate = entries[0].timestamp;
      entries.forEach((entry) => {
        if (entry.timestamp < minDate) {
          minDate = entry.timestamp;
        } else if (entry.timestamp > maxDate) {
          maxDate = entry.timestamp;
        }
      });

      this.importInfo = {
        entries,
        entryCount: entries.length,
        existingEntryCount,
        minDate,
        maxDate,
      };
    } catch (e) {
      this.importError = e;
    }

    const onClose = () => {
      this.importInfo = null;
      this.importError = null;
    };
    if (this.importDialogRef.getState() === MatDialogState.OPEN) {
      this.importDialogRef.afterClosed().subscribe(onClose);
    } else {
      onClose();
    }
  }

  async readEntriesFromFile(file: File) {
    const csvContent = await getTextFromFile(file);
    const csvRows = csvParseRows(csvContent);
    const headerRow = csvRows.shift(); // gets the first row and removes it from the array
    const timestampIndex = headerRow.indexOf('timestamp');
    const valueIndex = headerRow.indexOf('value');
    if (timestampIndex < 0 || valueIndex < 0) {
      throw new Error('some columns are missing');
    }
    const entries: IEntry[] = csvRows
      .map((row) => ({
        timestamp: new Date(row[timestampIndex]),
        value: +row[valueIndex],
      }))
      .filter((entry) => isFinite(entry.value));
    return entries;
  }

  async import() {
    if (this.importShouldReplaceEntries) {
      const dialog = this.dialog.open(this.importConfirmReplaceDialogTemplate, {
        maxWidth: 560,
        data: { existingEntryCount: this.importInfo.existingEntryCount },
      });
      const dialogResult = await dialog.afterClosed().toPromise();
      if (dialogResult !== 'confirm') {
        return;
      }
      await this.entryService.clearAllEntries();
    }
    await this.entryService.importEntries(this.importInfo.entries);
    this.importDialogRef.close();
    this.snackBar.openFromTemplate(this.importSuccessSnackBarTemplate, {
      duration: 3000,
      data: { entryCount: this.importInfo.entryCount },
    });
  }
}
