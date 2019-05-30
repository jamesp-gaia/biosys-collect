import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAddPage } from './site-add.page';

describe('SiteAddPage', () => {
  let component: SiteAddPage;
  let fixture: ComponentFixture<SiteAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
