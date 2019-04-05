import { Component } from '@angular/core';
import { AlertController,  LoadingController, NavController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

import {
  REGO_URL,
  PROJECT_NAME,
  SIGNUP_TERMS_AND_CONDITIONS_HTML,
  SIGNUP_TERMS_AND_CONDITIONS_HTML_OLD
} from '../shared/utils/consts';

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
    public form: FormGroup;

    public REGO_URL = REGO_URL;
    private dialog: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private apiService: APIService,
                private authService: AuthService,
                private storageService: StorageService,
                private formBuilder: FormBuilder,
                private alertController: AlertController,
                private loadingCtrl: LoadingController,
                private router: Router) {
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
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

    public async login() {
        const loading = this.loadingCtrl.create({
            message: 'Logging in'
        });
        (await loading).present();

        const username = this.form.value['username'];
        const password = this.form.value['password'];

        this.authService.login(username, password).subscribe(async() => {
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

                (await loading).dismiss();
                this.router.navigateByUrl('HomePage');
            },
            async(error) => {
                (await loading).dismiss();
                const apiResponse = formatAPIError(error) as ApiResponse;
                (await this.alertController.create({
                    header: 'Login Problem',
                    subHeader: !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
                        'There was a problem contacting the server, try again later',
                    buttons: ['Ok']
                })).present();
            }
        );
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
