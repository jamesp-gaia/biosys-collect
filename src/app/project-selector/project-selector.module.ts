import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectSelectorPage } from './project-selector.page';

const routes: Routes = [
  {
    path: 'project-selector',
    component: ProjectSelectorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProjectSelectorPage]
})
export class ProjectSelectorPageModule {}
