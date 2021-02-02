import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxFilesizeModule } from 'ngx-filesize';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { ChartPageComponent } from './chart-page/chart-page.component';
import { EntriesPageComponent } from './entry/entries-page/entries-page.component';
import { EntrieslistComponent } from './entry/entrieslist/entrieslist.component';
import { EntryDialogComponent } from './entry/entry-dialog/entry-dialog.component';
import { MaterialModule } from './material/material.module';
import { ImportExportPageComponent } from './import-export-page/import-export-page.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    ChartPageComponent,
    EntrieslistComponent,
    EntryDialogComponent,
    EntriesPageComponent,
    ImportExportPageComponent,
    SpinnerComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxFilesizeModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
