import { Component, OnInit } from '@angular/core';
import { IEntry } from '../interfaces/IEntry';
import { saveAs } from 'file-saver';
import { csvFormat } from 'd3-dsv';
import { DexieService } from '../services/dexie.service';

type ExportData = { entries: IEntry[]; date: Date };
@Component({
  selector: 'ti-import-export-page',
  templateUrl: './import-export-page.component.html',
  styleUrls: ['./import-export-page.component.css'],
})
export class ImportExportPageComponent implements OnInit {
  exportData: ExportData;

  constructor(private readonly dexieService: DexieService) {}

  ngOnInit() {}

  async generateExport() {
    this.exportData = {
      entries: await this.dexieService.entries.orderBy('timestamp').toArray(),
      date: new Date(),
    };
  }

  downloadExport(exportData: ExportData) {
    const csvContent = csvFormat(exportData.entries, ['timestamp', 'value']);
    saveAs(
      new Blob([csvContent], { type: 'text/csv' }),
      `TrackIt_Export_${this.getFormattedDateString(exportData.date)}.csv`
    );
    console.log(csvContent);
  }

  private getFormattedDateString(date: Date) {
    // https://stackoverflow.com/a/53335889
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const msLocal = date.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    const iso = dateLocal.toISOString();
    const isoLocal = iso.slice(0, 19);
    return isoLocal.replace('T', '_').replace(/[:-]/g, '-');
  }
}
