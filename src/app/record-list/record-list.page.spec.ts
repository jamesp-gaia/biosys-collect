import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordListPage } from './record-list.page';

describe('RecordListPage', () => {
  let component: RecordListPage;
  let fixture: ComponentFixture<RecordListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
