import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../biosys-core/services/auth.service';
import { Dataset, User } from '../biosys-core/interfaces/api.interfaces';
import { APIService } from '../biosys-core/services/api.service';
import { StorageService } from '../shared/services/storage.service';
import { formatAPIError } from '../biosys-core/utils/functions';
import { ApiResponse } from '../shared/interfaces/mobile.interfaces';

import { SignUpPage } from '../sign-up/sign-up';

import { PROJECT_NAME, REGO_URL, SIGNUP_TERMS_AND_CONDITIONS_HTML } from '../shared/utils/consts';

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
  // public form: FormGroup;

  public REGO_URL = REGO_URL;
  private dialog: any;
  private loading: any;

  constructor(private apiService: APIService,
              private authService: AuthService,
              private storageService: StorageService,
              private alertController: AlertController,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private router: Router) {
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

  public async login(form, username, password) {
    try {
      this.router.navigate(['project-selector']).then(
        (x) => {
          console.log('navyes', x);
        },
        (y) => {
          console.log('navno', y);
        });
    } catch (e) {
     console.log('e', e);
    }
    return;
    from(this.presentLoading({
      message: 'Logging in...'
    }))
    .pipe(mergeMap(() => this.authService.login(username, password)))
    .subscribe(() =>  {
        const params = {
          project__name: PROJECT_NAME
        };

        this.apiService.getDatasets(params).pipe(
          mergeMap((datasets: Dataset[]) => from(datasets).pipe(
            mergeMap((dataset: Dataset) => this.storageService.putDataset(dataset))
          ))
        ).subscribe();

        this.apiService.getUsers(params).pipe(
          mergeMap((users: User[]) => this.storageService.putTeamMembers(users))
        ).subscribe();
        this.loading.dismiss();
        console.log('logging', 'Trying to nav');
        // const foo = this.router.navigateByUrl('/project-selector')
        // console.log('navnav', foo);
        // foo.then( (value) => {
        //   console.log('navyes', value);
        // }, (reason) => {
        //   console.log('navno', reason);
        // });
        this.router.navigate(['/project-selector']);
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
}
