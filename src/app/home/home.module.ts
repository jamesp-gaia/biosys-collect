import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomePage } from './home';
import { ComponentsModule } from '../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    ComponentsModule,
    FontAwesomeModule
  ],
})
export class HomePageModule {
  constructor() {
    library.add(faBars);
  }
}
