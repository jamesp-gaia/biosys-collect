import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectorPage } from './project-selector.page';

describe('ProjectSelectorPage', () => {
  let component: ProjectSelectorPage;
  let fixture: ComponentFixture<ProjectSelectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSelectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
