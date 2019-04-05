import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SignUpPage } from './sign-up';

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    IonicModule.forRoot(),
    RouterModule.forChild([{ path: '', component: SignUpPage }]),
  ],
})
export class SignUpPageModule {}
