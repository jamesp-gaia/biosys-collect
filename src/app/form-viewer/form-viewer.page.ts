import { Component, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';
import { Router } from '@angular/router';
import { JsonPointer } from 'angular6-json-schema-form';
import { Location } from '@angular/common';
import { StorageService } from '../shared/services/storage.service';
import { ClientRecord } from '../shared/interfaces/mobile.interfaces';
import * as moment from 'moment/moment';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { UUID } from 'angular2-uuid';
import { Observable, Subscription } from 'rxjs';
import { GEOLOCATION_MAX_AGE, GEOLOCATION_TIMEOUT } from '../shared/utils/consts';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.page.html',
  styleUrls: ['./form-viewer.page.scss'],
})
export class FormViewerPage implements OnDestroy {
  public schemaSchema: any;
  public formSchema: any;
  public formData: any;
  public formRecord: any;

  private formValidationErrors: any;
  private formIsValid = null;
  private submittedFormData: any = null;
  private validationErrorToDisplay = '';

  private coordinates: any = {};
  private locationObservable: Observable<Geoposition>;
  private locationSubscription: Subscription;
  private isEdit = false;

  private data = {};

  public formParameters = {
    // https://github.com/hamzahamidi/angular6-json-schema-form#readme
    /* Single-input mode
    You may also combine all your inputs into one compound object and include it as a form input, like so:
      const yourCompoundInputObject = {
        schema:    { ... },  // REQUIRED
        layout:    [ ... ],  // optional
        data:      { ... },  // optional
        options:   { ... },  // optional
        widgets:   { ... },  // optional
        language:   '...' ,  // optional
        framework:  '...'    // (or { ... }) optional
      }

     This allows us to provide a data object only if we are editing.
     */
  };

  constructor(private mobileService: MobileService,
              private router: Router,
              private pageLocation: Location,
              private storage: StorageService,
              private geolocation: Geolocation
  ) {
    // TODO: 2019-05-27: use this to enable "edit" from Upload screen
    this.formRecord = this.mobileService.formEditData;
    if (this.formRecord) {
      this.isEdit = true;
      this.formData = this.formRecord.data;
      this.data = this.formRecord.data;
      this.formParameters['data'] = this.formRecord.data;
    }

    this.schemaSchema = mobileService.getViewForm();
    this.formSchema = mobileService.morphForm(this.schemaSchema['table_schema']);
    console.log('formGenScheme', JSON.stringify(this.formSchema));

    this.formParameters['schema'] = this.formSchema.jsonSchema;
    if (!this.schemaSchema.layout.hasOwnProperty('test')) {
      this.formParameters['layout'] = this.schemaSchema.layout;
    }

    console.log('formview', this.formParameters);
    console.log('formview', JSON.stringify(this.formParameters));

    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: GEOLOCATION_MAX_AGE,
      timeout: GEOLOCATION_TIMEOUT,
    };
    this.locationObservable = this.geolocation.watchPosition(watchOptions);
    this.locationSubscription = this.locationObservable.subscribe( (position) => {
      if (!this.isEdit && position.coords) {
        console.log('gps_ok', position);
        this.coordinates.latitude = position.coords.latitude;
        this.coordinates.longitude = position.coords.longitude;
        this.coordinates.accuracy = position.coords.accuracy;
        this.coordinates.altitude = position.coords.altitude;
        this.coordinates.altitudeAccuracy = position.coords.altitudeAccuracy;
        this.coordinates.heading = position.coords.heading;
        this.coordinates.speed = position.coords.speed;
        this.updateLocationFields();
      }
    }, (error) => {
      console.log('gps_err', error);
    });
    return;
  }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  onChange(event) {
    for (const parameter in this.formParameters['schema']['properties']) {
      if (this.formParameters['schema']['properties'][parameter]['format'] === 'date-time' ||
        this.formParameters['schema']['properties'][parameter]['format'] === 'datetime') {
        if (this.data[parameter].endsWith('Z')) {
          this.data[parameter] = this.data[parameter].replace('Z', '');
        }
      }
    }
    return;
  }

  onSubmit(data: any) {
    console.log('submitted', data);
    if (this.formIsValid) {
      // TODO: work out how to patch coordinate data into the depths of the schema
      if (!this.coordinates) {
        alert('Still reading location - try again later');
        return;
      }

      console.log('location-submit', this.coordinates);

      if (this.isEdit) {
        data['location'] = this.formData['location'];
      } else {
        data['location'] = {
          latitude: this.coordinates.latitude,
          longitude: this.coordinates.longitude,
          accuracy: this.coordinates.accuracy,
          altitude: this.coordinates.altitude,
          altitudeAccuracy: this.coordinates.altitudeAccuracy,
          heading: this.coordinates.heading,
          speed: this.coordinates.speed,
        };
      }
      this.submittedFormData = data;
      if (this.isEdit) {
        console.log('putid1', this.formData);
      }
      const theRecord: ClientRecord = {
        valid: true,
        datasetName: this.schemaSchema.name,
        datetime: this.isEdit ? this.formRecord.datetime : moment().format(),
        count: 1,
        photoIds: [],
        dataset: this.schemaSchema.dataset,
        client_id: this.isEdit ? this.formRecord.client_id : UUID.UUID(),
        data: data,
      };
      this.storage.putRecord(theRecord).subscribe((ok) => {
        console.log('putok', ok);
        this.pageLocation.back();
      }, (err) => {
        console.log('puterr', err);
      });
    } else {
      alert(this.validationErrorToDisplay);
    }
    return;
  }

  isValid(isValid: boolean): void {
    this.formIsValid = isValid;
  }

  getFieldTitle(titlePath: string): string {
    const path = titlePath.split('/');
    let thing = this.formSchema.layout.schema.properties;
    thing = thing[path[path.length - 1 ]];
    return thing.title || '';
  }

  validationErrors(data: any): void {
    try {
      console.log('valerr', data);
      this.formValidationErrors = data;
      if (data.length > 0) {
        const err = data[0];
        if (err.keyword === 'required') {
          this.validationErrorToDisplay = `${err.message || ''}`;
        } else {
          const path = err.dataPath.split('/');
          let thing = this.formSchema.layout.schema.properties;
          thing = thing[path[path.length - 1]];
          this.validationErrorToDisplay = `${thing.title || ''}: ${err.message}`;
        }
      }
    } catch (exception) {
      this.validationErrorToDisplay = '';
    }
    return;
  }

  public updateLocationFields(initialUpdate = false) {
    console.log('schema', this.formParameters);
    console.log('data', this.data);
    if (!this.formParameters || !Object.keys(this.data).length ) {
      return;
    }
    if (this.formParameters['schema']['properties'].hasOwnProperty('Latitude')) {
      console.log('haslat', 'yes');
      this.data['Latitude'] = this.coordinates.latitude.toFixed(6);
    }

    if (this.formParameters['schema']['properties'].hasOwnProperty('Longitude')) {
      this.data['Longitude'] = this.coordinates.longitude.toFixed(6);
    }

    if (this.formParameters['schema']['properties'].hasOwnProperty('Accuracy')) {
      this.data['Accuracy'] = Math.round(this.coordinates.accuracy);
    }

    if (this.formParameters['schema']['properties'].hasOwnProperty('Altitude')) {
      this.data['Altitude'] = Math.round(this.coordinates.altitude);
    }
    return;
  }
}
