import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.page.html',
  styleUrls: ['./project-selector.page.scss'],
})
export class ProjectSelectorPage implements OnInit {

  public projects = [
    {
      name: 'Hello'
    },
    {
      name: 'Test'
    },
    {
      name: 'Fooboos'
    }
  ];

  constructor() { }

  ngOnInit() {}

  public projectClick(project: any) {
    return;
  }

}
