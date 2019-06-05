import { Component, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-selector',
  templateUrl: './form-selector.page.html',
  styleUrls: ['./form-selector.page.scss'],
})
export class FormSelectorPage implements OnInit {
  public forms: any;
  public offline: boolean;

  constructor(private router: Router,
              private mobileService: MobileService) {
    this.forms = mobileService.getProjectForms(mobileService.currentProject.id);
  }

  ngOnInit() {
    this.offline = this.mobileService.offline;
  }

  public formClicked(form: any) {
    this.mobileService.setViewForm(form);
    this.mobileService.formEditData = null;
    this.router.navigateByUrl('form-viewer');
  }

  public sitesClicked() {
    this.router.navigateByUrl('site-viewer');
    return;
  }

  public uploadClicked() {
    this.router.navigateByUrl('upload');
  }
}
