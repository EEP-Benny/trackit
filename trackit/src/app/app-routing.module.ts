import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntriesPageComponent } from './entry/entries-page/entries-page.component';
import { ChartPageComponent } from './chart-page/chart-page.component';
import { ImportExportPageComponent } from './import-export-page/import-export-page.component';

const routes: Routes = [
  { path: 'entries', component: EntriesPageComponent },
  { path: 'chart', component: ChartPageComponent },
  { path: 'import-export', component: ImportExportPageComponent },
  { path: '', redirectTo: '/entries', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
