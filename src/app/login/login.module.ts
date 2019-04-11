import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoginPage } from './login';
import { FormsModule } from '@angular/forms';

import { StorageService } from '../shared/services/storage.service';
import { UploadService } from '../shared/services/upload.service';
import { APIService } from '../biosys-core/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../biosys-core/services/auth.service';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StorageService,
    UploadService,
    AuthService,
    APIService
  ]
})
export class LoginPageModule {}
