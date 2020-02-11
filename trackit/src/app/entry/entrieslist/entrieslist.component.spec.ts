import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrieslistComponent } from './entrieslist.component';

describe('EntrieslistComponent', () => {
  let component: EntrieslistComponent;
  let fixture: ComponentFixture<EntrieslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntrieslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
