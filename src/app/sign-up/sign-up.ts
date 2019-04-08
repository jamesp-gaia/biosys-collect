import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from '@ionic/angular';
import { APP_NAME, SIGNUP_TERMS_AND_CONDITIONS_HTML } from '../shared/utils/consts';
import { FormBuilder, Validators } from '@angular/forms';
import { formatAPIError } from '../biosys-core/utils/functions';
import { ApiResponse } from '../shared/interfaces/mobile.interfaces';
import { AuthService } from '../biosys-core/services/auth.service';
import { SignupService } from '../shared/services/signup.service';
import { async } from 'q';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage implements OnInit {
  public APP_NAME = APP_NAME;
  public form: any;
  private passwordsMatch = true;
  private passwordsOK = false;
  private passwordsAdvice = '';
  private usernameOK = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private signupService: SignupService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private loadingCtrl: LoadingController,
              private alertController: AlertController) {
    this.form = this.formBuilder.group({
      'name_user': ['', Validators.required],
      'name_given': ['', Validators.required],
      'name_last': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'password_again': ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  private signup() {
    this.doSignup();
  }

  private goBack() {
    this.navCtrl.pop();
  }


  public async doSignup() {
    const loading = this.loadingCtrl.create({
      message: 'Creating Your Account...'
    });
    (await loading).present();

    const username = this.form.value['name_user'];
    const password = this.form.value['password'];
    const password2 = this.form.value['password_again'];
    const email = this.form.value['email'];
    const first = this.form.value['name_given'];
    const last = this.form.value['name_last'];

    this.signupService.signUp(username, password, email, first, last).subscribe(async() => {
      (await loading).dismiss();
      (await this.alertController.create({
        header: 'Signed Up',
        subHeader: 'Your account has been created, and you can now login!',
        buttons: ['Ok']
      })).present().then(() => {
        // navigate back to the login page:
        this.navCtrl.pop();
      });
      return;
    }, async(error) => {
      (await loading).dismiss().then(() => {/* meh */
      });
      const apiResponse = formatAPIError(error) as ApiResponse;
      if (!apiResponse.hasOwnProperty('status')) {
        return;
      }
      let subTitle = !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
        'There was a problem contacting the server, try again later';
      switch (error.status) {
        case 400:
        case 409:
          // technically this is a "account already exists" but we need to be vague?
          subTitle = 'We were unable to create your account. This could be because ' +
            ' your username or email address is already in use, or is invalid. ' +
            'Please check your details and try again.';
          break;
      }
      (await this.alertController.create({
        header: 'Sign-Up Problem',
        subHeader: subTitle,
        buttons: ['Ok']
      })).present();
    });
    return;
  }

  ionViewDidLoad() {
  }

  private passwordCheck() {
    const thePasswd = this.form.value['password'];
    this.passwordsMatch = this.form.value['password'] === this.form.value['password_again'] || false;
    if (thePasswd.indexOf('>') >= 0 || thePasswd.indexOf('<') >= 0) {
      this.passwordsAdvice = 'Password may not contain < or >';
      this.passwordsOK = false;
      return;
    }
    if (thePasswd.length < 8) {
      this.passwordsAdvice = 'Password is too short';
      this.passwordsOK = false;
      return;
    }
    if (thePasswd.length > 16) {
      this.passwordsAdvice = 'Password is too long';
      this.passwordsOK = false;
      return;
    }
    if (!/[a-z]/.test(thePasswd)) {
      this.passwordsAdvice = 'Password must contain a lower case letter';
      this.passwordsOK = false;
      return;
    }
    if (!/[A-Z]/.test(thePasswd)) {
      this.passwordsAdvice = 'Password must contain an upper case letter';
      this.passwordsOK = false;
      return;
    }
    if (!/[0-9]/.test(thePasswd)) {
      this.passwordsAdvice = 'Password must contain a digit';
      this.passwordsOK = false;
      return;
    }
    this.passwordsAdvice = '';
    this.passwordsOK = true;
  }

  private usernameCheck() {
    const username = this.form.value['name_user'];
    const reg = new RegExp('^[\\w.@+-]+$');
    this.usernameOK = reg.test(username);
  }
}

// FIXME: android:windowSoftInputMode="adjustPan" needs to be added to the Android manifest
