import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntrieslistComponent } from './entrieslist.component';

describe('EntrieslistComponent', () => {
  let component: EntrieslistComponent;
  let fixture: ComponentFixture<EntrieslistComponent>;

  beforeEach(waitForAsync(() => {
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
