import { Component, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';

@Component({
  selector: 'app-form-selector',
  templateUrl: './form-selector.page.html',
  styleUrls: ['./form-selector.page.scss'],
})
export class FormSelectorPage implements OnInit {
  public forms: any;

  constructor(mobileService: MobileService) {
    this.forms = mobileService.getProjectForms(mobileService.currentProject.id);
  }

  ngOnInit() {
  }

  public formClicked(form: any) {
    alert(form.name);
  }

  public sitesClicked() {
    return;
  }
}
