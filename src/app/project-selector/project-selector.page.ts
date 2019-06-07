import { Component, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.page.html',
  styleUrls: ['./project-selector.page.scss'],
})
export class ProjectSelectorPage {

  private clickedStatus = {};
  private loading: any;

  constructor(private loadingCtrl: LoadingController,
              private alertController: AlertController,
              private router: Router,
              public mobileState: MobileService,
              private storage: Storage,
              private pageLocation: Location
  ) {
  }

  private async presentLoading(config?: any): Promise<any> {
    this.loading = await this.loadingCtrl.create(config);
    return await this.loading.present();
  }

  private async projectGo(project: any, forms: any) {
    const theForms = [];
    for (const i in forms) {
      if (parseInt(i, 10) && i) {
        const form = forms[i];
        form['form_id'] = parseInt(i, 10);
        theForms.push(form);
      }
    }
    this.mobileState.setProjectForms(project.id, theForms);
    await this.loading.dismiss();
    this.router.navigateByUrl('/form-selector');
  }

  public async projectClicked(project: any) {
    this.mobileState.currentProject = project;
    from (this.presentLoading({
      message: 'Loading forms for this project ...',
      // duration: 500
    })).subscribe( () => {

      if (this.mobileState.offline) {
        this.storage.get('Project' + project.id + '_Forms').then( async (forms) => {
          console.log('offlineformget', forms);
          this.projectGo(project, forms);
        });
      } else {
        this.mobileState.getForms(project).subscribe(
      async (forms) => {
            this.projectGo(project, forms);
          }, async (err) => {
            await this.loading.dismiss();
          });
      }
    });
    return;
  }

  public projectToggle(project: any) {
    if (this.clickedStatus[project.id]) {
      delete this.clickedStatus[project.id];
    } else {
      this.clickedStatus[project.id] = true;
    }
    return;
  }

  public async offlineToggle() {
    if (!this.mobileState.offline) {
      if (Object.keys(this.clickedStatus).length <= 0) {
        (await this.alertController.create({
            header: 'No projects selected',
            subHeader: 'No projects were selected for pre-loading. Select the projects you wish to access while offline and try again.',
            buttons: ['Ok']
          })).present();
      } else {
        this.loading = await this.loadingCtrl.create({
          message: 'Caching projects for offline use ...',
          duration: 2000
        });

        await this.loading.present();
        // projects should be saved to local storage here:
        this.mobileState.offlineGo(this.clickedStatus);
        await this.loading.dismiss();
        // Now we are clear to go offline
        this.mobileState.offline = true;
      }
    } else {
      this.mobileState.offline = false;
      this.router.navigateByUrl('/');
    }
    return;
  }
}
