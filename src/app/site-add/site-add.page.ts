import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';
import { Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { GEOLOCATION_MAX_AGE, GEOLOCATION_TIMEOUT } from '../shared/utils/consts';
import { Observable, Subscription } from 'rxjs';
import { Site } from '../biosys-core/interfaces/api.interfaces';
import { APIService } from '../biosys-core/services/api.service';

@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.page.html',
  styleUrls: ['./site-add.page.scss'],
})
export class SiteAddPage implements OnInit, OnDestroy {
  private locationObservable: Observable<Geoposition>;
  private locationSubscription: Subscription;

  private positionValid = false;
  public position = {
    latitude: undefined,
    longitude: undefined,
    accuracy: undefined
  };

  public latitude: number;
  public longitude: number;
  public accuracy: number;

  public siteCode: string;
  public siteName: string;
  public siteDescription: string;

  constructor(private mobileState: MobileService,
              private router: Router,
              private geolocation: Geolocation,
              private apiService: APIService) { }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  addTheSite() {
    const site: Site = {
      code: this.siteCode,
      name: this.siteName,
      description: this.siteDescription,
      project: this.mobileState.currentProject.id,
      geometry: {
        type: 'Point',
        coordinates: [
          this.longitude,
          this.latitude
        ]
      }
    };
    this.apiService.createSite(site).subscribe( (x) => {
      return;
    }, (err) => {
      return;
    });
    return;
  }

  ngOnInit() {
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: GEOLOCATION_MAX_AGE,
      timeout: GEOLOCATION_TIMEOUT,
    };
    this.locationObservable = this.geolocation.watchPosition(watchOptions);
    this.locationSubscription = this.locationObservable.subscribe( (position) => {
      if (position.coords) {
        console.log('gps_ok', position);
        this.position.latitude = position.coords.latitude;
        this.position.longitude = position.coords.longitude;
        this.position.accuracy = position.coords.accuracy;
        this.positionValid = true;
      }
    }, (error) => {
      console.log('gps_err', error);
    });
  }

  useLocation() {
    if (!this.positionValid) {
      alert('Still waiting for a location. Please try again later.');
      return;
    }
    this.latitude = this.position.latitude;
    this.longitude = this.position.longitude;
    this.accuracy = this.position.accuracy;
    return;
  }
}
