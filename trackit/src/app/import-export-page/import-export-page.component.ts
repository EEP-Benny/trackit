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

  downloadExport(exportData: ExportData, filename: string) {
    const csvContent = csvFormat(exportData.entries, ['timestamp', 'value']);
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(csvBlob, filename);
  }
}
