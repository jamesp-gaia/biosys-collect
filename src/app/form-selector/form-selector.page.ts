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

  constructor(private router: Router,
              private mobileService: MobileService) {
    const forms = mobileService.getProjectForms(mobileService.currentProject.id);
    this.forms = [];
    for (const key in forms) {
      if (key) {
        console.log('formform', JSON.stringify(forms[key]));
        this.forms.push(forms[key]);
      }
    }
  }

  ngOnInit() {
  }

  public formClicked(form: any) {
    this.mobileService.setViewForm(form);
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
