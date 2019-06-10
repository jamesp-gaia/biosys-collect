import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectSelectorPage } from './project-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectSelectorPage
      },
    ])
  ],
  declarations: [ProjectSelectorPage],
  exports: [ProjectSelectorPage]
})
export class ProjectSelectorPageModule {}
