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
    let form;
    for (const project of this.mobileService.projects) {
      // const project = this.mobileService.currentProject;
      const forms = this.mobileService.getProjectForms(project.id);
      console.log('editdata', JSON.stringify(x)); // FIXME
      for (const i of forms) {
        console.log('formsearch', JSON.stringify(i));
        if (i.dataset === x.dataset) {
          form = i;
          break;
        }
        if (i['children']) {
          for (const child of i['children']) {
            if (child.dataset === x.dataset) {
              form = child;
              break;
            }
          }
        }
      }
    }
    console.log('editform', JSON.stringify(form));
    this.mobileService.setViewForm(form);
    this.mobileService.formEditData = x;
    this.router.navigateByUrl('form-viewer');
    return;
  }
}
