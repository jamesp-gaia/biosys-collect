import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicModule.forRoot(),
    RouterModule.forChild([{ path: '', component: LoginPage }]),
  ],
})
export class LoginPageModule {}
