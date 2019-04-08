import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HelpPage } from './help';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicModule.forRoot(),
    RouterModule.forChild([{ path: '', component: HelpPage }]),
    FontAwesomeModule
  ],
  entryComponents: [
    HelpPage,
  ]
})
export class HelpPageModule {
  constructor() {
    library.add(faBars);
  }
}
