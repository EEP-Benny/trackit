import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExportPageComponent } from './import-export-page.component';

describe('ImportExportPageComponent', () => {
  let component: ImportExportPageComponent;
  let fixture: ComponentFixture<ImportExportPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportExportPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
