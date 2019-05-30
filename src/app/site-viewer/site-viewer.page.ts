import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { MobileService } from '../shared/services/mobile.service';

@Component({
  selector: 'app-site-viewer',
  templateUrl: './site-viewer.page.html',
  styleUrls: ['./site-viewer.page.scss'],
})
export class SiteViewerPage implements OnInit {
  private sites: [];

  constructor(private loadingCtrl: LoadingController, private alertController: AlertController,
              private router: Router, public mobileState: MobileService) {
    return;
  }

  ngOnInit() {
    this.loadingCtrl.create({
      message: 'Loading sites for this project ...'
    }).then ((ctrl) => {
      console.log('sites');
      this.mobileState.getAllSitesForProjectID(this.mobileState.currentProject.id)
        .subscribe(
          (stuff) => {
            this.sites = stuff;
            return;
          },
          (err) => {
            return;
          });
    });
  }

  addSite() {
  }
}
