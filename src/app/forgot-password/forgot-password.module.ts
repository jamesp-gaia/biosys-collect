import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordPage } from './forgot-password';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    IonicModule.forRoot(),
    RouterModule.forChild([{ path: '', component: ForgotPasswordPage }])
  ],
})
export class ForgotPasswordPageModule {}
