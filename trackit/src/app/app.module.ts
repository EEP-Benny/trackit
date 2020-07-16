import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { EntriesPageComponent } from './entry/entries-page/entries-page.component';
import { EntrieslistComponent } from './entry/entrieslist/entrieslist.component';
import { EntryformComponent } from './entry/entryform/entryform.component';
import { MaterialModule } from './material/material.module';
import { ImportExportPageComponent } from './import-export-page/import-export-page.component';

@NgModule({
  declarations: [
    AppComponent,
    EntrieslistComponent,
    EntryformComponent,
    EntriesPageComponent,
    ImportExportPageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
