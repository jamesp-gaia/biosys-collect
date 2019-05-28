import { Component, OnInit } from '@angular/core';
import { Environment, GoogleMap, GoogleMapOptions, GoogleMaps, LatLng, Marker, MyLocation } from '@ionic-native/google-maps';
import { AlertController, LoadingController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { StorageService } from '../shared/services/storage.service';
import { GoogleMapsEvent } from '@ionic-native/google-maps/ngx';
import { APIService } from '../biosys-core/services/api.service';
import { MobileService } from '../shared/services/mobile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  private map: GoogleMap;
  private markers: Marker[] = [];
  private pinCount = 0;

  constructor(private loadingCtrl: LoadingController,
              private alertController: AlertController,
              private storageService: StorageService,
              private apiService: APIService,
              private router: Router,
              private mobileService: MobileService
              ) { }

  ngOnInit() {
    this.loadMap();
  }

  ionViewDidLoad() {
  }

  loadMap() {
    this.map = GoogleMaps.create('map', {
      'backgroundColor': 'white',
      'building': false,
      'mapType': 'MAP_TYPE_HYBRID',
      'controls': {
        'compass': false,
        'zoom': false,
        'indoorPicker': false,
      },
      'gestures': {
        'scroll': true,
        'zoom': true,
        'tilt': false,
        'rotate': false,
      },
      'camera': {
        target: new LatLng(-25, 132),
        zoom: 4,
        tilt: 0
      },
    });
    this.map.setMyLocationEnabled(true);
    this.map.setMyLocationButtonEnabled(true);
    this.populateMarkers(this.map);
  }

  private populateMarkers(map: GoogleMap) {
    this.storageService.getUploadableRecords().subscribe( (x) => {
      console.log('popok', x);
      if (x.data.location.latitude && x.data.location.longitude) {
        const marker = map.addMarkerSync({
          title: x.datetime,
          icon: x.valid ? 'blue' : 'red',
          position: {
            lat: x.data.location.latitude,
            lng: x.data.location.longitude
          }
        });
        this.markers[x.client_id] = marker;
        this.pinCount++;
        marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
          this.markerClicked(marker, x);
        });
      }
      return;
    }, (err) => {
      console.log('poperr', err);
    });
    return;
  }

  private markerClicked(marker: Marker, x: any) {
    alert(x.client_id);
    const project = this.mobileService.currentProject;
    const forms = this.mobileService.getProjectForms(project.id);
    console.log('editforms', forms);
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

  async uploadClicked() {
    const foo = await this.loadingCtrl.create({
      message: 'Uploading data for this project ...',
    });
    await foo.present();
    this.storageService.getUploadableRecords().subscribe( (x) => {
      if (x.data.location.latitude && x.data.location.longitude) {
        this.apiService.createRecord(x, false).subscribe(async (value) => {
          console.log('upload', x.client_id);
          this.markers[x.client_id].remove();
          this.storageService.deleteRecord(x.client_id);
          if (--this.pinCount === 0) {
            await foo.dismiss();
            (await this.alertController.create({
              header: 'Upload Complete',
              subHeader: 'Records "uploaded"',
              buttons: ['Ok']
            })).present();
          }
        }, async (err) => {
          console.log('upErr', err);
          if (--this.pinCount === 0) {
            await foo.dismiss();
            (await this.alertController.create({
              header: 'Upload Complete',
              subHeader: 'Records "uploaded"',
              buttons: ['Ok']
            })).present();
          }
        });
      }
    });
  }
}
