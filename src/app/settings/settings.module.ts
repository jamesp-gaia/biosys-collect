import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SettingsPage } from './settings';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicModule.forRoot(),
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    FontAwesomeModule
  ],
})
export class SettingsPageModule {
  constructor() {
    library.add(faBars);
  }
}
