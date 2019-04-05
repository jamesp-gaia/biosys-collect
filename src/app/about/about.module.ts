import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AboutPage } from './about';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    FontAwesomeModule,
    IonicModule.forRoot(),
    RouterModule.forChild([{ path: '', component: AboutPage }])
  ],
})

export class AboutPageModule {
  constructor() {
    library.add(faBars);
  }
}
