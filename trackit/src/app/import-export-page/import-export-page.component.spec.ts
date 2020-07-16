import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportPageComponent } from './import-export-page.component';

describe('ImportExportPageComponent', () => {
  let component: ImportExportPageComponent;
  let fixture: ComponentFixture<ImportExportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
