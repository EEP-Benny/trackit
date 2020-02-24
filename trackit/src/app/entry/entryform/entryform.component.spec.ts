import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryformComponent } from './entryform.component';

describe('EntryformComponent', () => {
  let component: EntryformComponent;
  let fixture: ComponentFixture<EntryformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
