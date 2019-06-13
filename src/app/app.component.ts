import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // ionic by default blocks the back button when you're at the bottom of
      // the URL navigation stack. Not good smartphone device UX notwithstanding,
      // the client has asked for normal behaviour to be restored:
      this.platform.backButton.subscribeWithPriority( 0, () => {
        if (this.router.url === '/login') {
          navigator['app'].exitApp();
        } else {
          this.navCtrl.pop();
        }
      });
    });
  }
}
