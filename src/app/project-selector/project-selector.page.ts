import { Component, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.page.html',
  styleUrls: ['./project-selector.page.scss'],
})
export class ProjectSelectorPage implements OnInit {

  private clickedStatus = {};
  private loading: Promise<any>;

  constructor(private loadingCtrl: LoadingController, private alertController: AlertController,
              private router: Router, public mobileState: MobileService) {
  }

  ngOnInit() {}

  public projectGo(project: any) {
    this.mobileState.currentProject = project;
    this.loading = this.loadingCtrl.create({
      message: 'Loading forms for this project ...'
    });
    this.loading.then( (formControl) => {
      this.mobileState.getForms(project).subscribe(
        (forms) => {
          console.log('forms', forms);
          this.mobileState.setProjectForms(project.id, forms);
          this.router.navigateByUrl('/form-selector');
        }, (err) => {
          console.log('err', err);
        });
    }, (err) => {});
    return;
  }

  public projectToggle(project: any, isChecked: boolean) {
    this.clickedStatus[project.name] = isChecked;
    return;
  }

  public upload() {
    return;
  }

  public offlineToggle() {
    if (!this.mobileState.offline) {
      if (Object.keys(this.clickedStatus).length <= 0) {
        setTimeout(async () => {
          (await this.alertController.create({
            header: 'No projects selected',
            subHeader: 'No projects were selected for pre-loading. Select the projects you wish to access while offline and try again.',
            buttons: ['Ok']
          })).present();
        }, 200);
      } else {
        setTimeout(async () => {
          this.loading = this.loadingCtrl.create({
            message: 'Caching projects for offline use ...'
          });
          this.loading.then( (ok) => {});
          // TODO: perform caching action here
        }, 200);
        // Now we are clear to go offline
        this.mobileState.offlineToggle();
      }
    } else {
      this.mobileState.offlineToggle();
    }
    return;
  }
}
