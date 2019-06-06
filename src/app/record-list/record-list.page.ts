import { Component, OnInit } from '@angular/core';
import { GoogleMapsEvent } from '@ionic-native/google-maps/ngx';
import { StorageService } from '../shared/services/storage.service';
import { ClientRecord } from '../shared/interfaces/mobile.interfaces';
import { MobileService } from '../shared/services/mobile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.page.html',
  styleUrls: ['./record-list.page.scss'],
})
export class RecordListPage implements OnInit {
  public records: ClientRecord[];
  constructor(private storageService: StorageService,
              private mobileService: MobileService,
              private router: Router) {
    this.records = [];
  }

  ngOnInit() {
    setTimeout (() => {
      const theResults = [];
      this.storageService.getUploadableRecords().subscribe((x) => {
        // TODO: filter by project / dataset
        console.log('popok', x);
        theResults.push(x);
      }, () => {}, () => {
        this.records = theResults;
      });
    }, 500);
  }

  clicked(x: ClientRecord) {
    const project = this.mobileService.currentProject;
    const forms = this.mobileService.getProjectForms(project.id);
    let form;
    for (const i of forms) {
      if (i.dataset === x.dataset) {
        form = i;
      }
    }
    console.log('editform', form);
    console.log('editdata', x); // FIXME
    this.mobileService.setViewForm(form);
    this.mobileService.formEditData = x;
    this.router.navigateByUrl('form-viewer');
    return;
  }
}
