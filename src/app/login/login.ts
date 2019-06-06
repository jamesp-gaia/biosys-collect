import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../biosys-core/services/auth.service';
import { APIService } from '../biosys-core/services/api.service';
import { StorageService } from '../shared/services/storage.service';
import { formatAPIError } from '../biosys-core/utils/functions';
import { ApiResponse } from '../shared/interfaces/mobile.interfaces';

import { SignUpPage } from '../sign-up/sign-up';

import { REGO_URL, SIGNUP_TERMS_AND_CONDITIONS_HTML } from '../shared/utils/consts';
import { MobileService } from '../shared/services/mobile.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public REGO_URL = REGO_URL;
  private dialog: any;
  private loading: any;

  constructor(private apiService: APIService,
              private authService: AuthService,
              private storageService: StorageService,
              private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private router: Router,
              private mobileState: MobileService,
              private storage: Storage) {
  }


  private async presentLoading(config?: any): Promise<any> {
    this.loading = await this.loadingCtrl.create(config);
    return await this.loading.present();
  }

  public signup() {
    this.dialog = this.alertController.create({
      header: 'Terms and Conditions',
      subHeader: 'To sign up to I See Koala you\'ll need to agree to the following terms and conditions:',
      message: SIGNUP_TERMS_AND_CONDITIONS_HTML,
      mode: 'md',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.router.navigateByUrl('SignUpPage');
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });
    this.dialog.present().then((result) => {
    });
    return;
  }

  private loginOK() {
    // call this when we have established that we think we are logged in...
    console.log('current', this.mobileState.offline);
    if (this.mobileState.offline === true) {
      console.log('login-ok', 'is offline');
      this.storage.get('projects').then( (projects) => {
        // FIXME: convert string to json blob
        this.mobileState.projects = JSON.parse(projects);
        this.router.navigateByUrl('/project-selector');
      });
      return;
    } else {
      this.apiService.getProjects({}).subscribe((result) => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.mobileState.projects = result;
        console.log('proj', result);
        this.router.navigateByUrl('/project-selector');
      }, (error) => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.alertController.create({
          header: 'Login Problem',
          subHeader: 'There was a problem contacting the server, try again later',
          buttons: ['Ok']
        }).then();
      });
    }
    return;
  }

  public async login(form, username, password) {
    from(this.presentLoading({
      message: 'Logging in...'
    }))
    .pipe(mergeMap(() => this.authService.login(username, password)))
    .subscribe(() =>  {
        this.loginOK();
      },
      async(e) => {
        this.loading.dismiss();
        const apiResponse = formatAPIError(e) as ApiResponse;
        (await this.alertController.create({
          header: 'Login Problem',
          subHeader: !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
            'There was a problem contacting the server, try again later',
          buttons: ['Ok']
        })).present();
      });
    return;
  }

  public async resetPassword() {
    const askEmail = (await this.alertController.create({
      header: 'Enter your email address',
      subHeader: 'To unlock your account, please enter your email address.',
      buttons: [
        {
          text: 'Ok',
          handler: async(deets) => {
            const waitingForReset = this.alertController.create( {
              header: 'Resetting your password',
              subHeader: 'Requesting a password reset for your account...',
              buttons: [ {
                text: 'Cancel',
                role: 'cancel',
              }]
            });
            (await waitingForReset).present();

            this.apiService.forgotPassword(deets.email).subscribe( async(ok) => {
                (await waitingForReset).dismiss();
                const done = this.alertController.create( {
                  header: 'Password Reset',
                  subHeader: 'Your password has been reset. Please check your email for more details.',
                  buttons: [ {
                    text: 'OK',
                    role: 'ok',
                  }]
                });
                (await done).present();
              },
              async(resetErr) => {
                (await waitingForReset).dismiss();
                const done = this.alertController.create( {
                  header: 'Password Reset Problem',
                  subHeader: 'There was a problem resetting your password. Please try again later.',
                  buttons: [ {
                    text: 'OK',
                    role: 'ok',
                  }]
                });
                (await done).present();
              });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ],
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Please enter your email address'
        }
      ]
    })).present();
  }

  ionViewWillEnter() {
    if (localStorage.getItem('auth_token') !== null) {
      setTimeout( () => {
        from(this.presentLoading({
          message: 'Logging in...'
        }))
        .subscribe(() =>  {
          this.loginOK();
        });
      }, 500);
    } else {
      return;
    }
    return;
  }
}
