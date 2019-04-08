import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomePage } from './home';
import { ComponentsModule } from '../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../shared/services/storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { UploadService } from '../shared/services/upload.service';
import { APIService } from 'biosys-core/services/api.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: HomePage }]),
    FontAwesomeModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    StorageService,
    UploadService,
    APIService
  ]
})
export class HomePageModule {
  constructor() {
    library.add(faBars);
  }
}
