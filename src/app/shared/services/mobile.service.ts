import { Inject, Injectable } from '@angular/core';
import { APIService } from '../../biosys-core/services/api.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

// Something to hold global state that is needed across the app.

@Injectable()
export class MobileService extends APIService {
  private _projects: any; // TODO: make interface

  private _offline = false;

  private _projectCurrent: any;

  private _forms: Array<any> = [];

  private _viewingForm: any;

  private _formEditData: any;

  private _siteList = [];

  constructor(@Inject(HttpClient) httpClient, private storage: Storage) {
    super(httpClient);
    storage.get('offline').then ((value) => {
      this._offline = value;
      console.log('offline-reload', this._offline);
    });
  }

  public get offline(): boolean {
    return this._offline;
  }

  public set offline(state: boolean) {
    this._offline = state;
    this.storage.set('offline', state);
  }

  public offlineGo(projects: any) {
    // the big fat "go offline" method

    const newProjects = [];

    // first up, update this._projects to only have the projects we are caching
    for (const theProject of this._projects) {
      if (theProject['id']) {
        for (const projectID in projects) {
          if (Number(projectID) === theProject.id) {
            newProjects.push(theProject);
            this.getForms(theProject).subscribe( (forms) => {
              this.storage.set('Project' + theProject.id + '_Forms', forms);
              this.setProjectForms(theProject.id, forms);
              console.log('formsCache', forms);
            });
          }
        }
      }
    }
    this._projects = newProjects;
    // now save it:
    this.storage.set('projects', JSON.stringify(newProjects));

    // now recursively download forms:
    // this.mobileState.getForms(project).subscribe(

    // TODO: insert tile download workflow code here
    return;
  }

  public get projects(): any {
    return this._projects;
  }

  public set projects(value: any) {
    this._projects = value;
  }

  public set currentProject(project: any) {
    this._projectCurrent = project;
  }

  public get currentProject() {
    return this._projectCurrent;
  }

  public getForms(project: any): Observable<any> {
    return this.httpClient.get(
      this.buildAbsoluteUrl('form-hierarchy/?project=' + project.id.toString(), false)
      // this.buildAbsoluteUrl('form-hierarchy/', false)
      , {
        headers: new HttpHeaders({
          'authorization': 'token ' + localStorage.getItem('auth_token')
        })
      }).pipe(
      catchError((err, caught) => this.handleError(err, caught))
    );
  }

  public setProjectForms(projectID: number, forms: any) {
    this._forms[projectID] = forms;
  }

  public getProjectForms(projectID: number) {
    return this._forms[projectID];
  }

  public setViewForm(form: any) {
    this._viewingForm = form;
  }
  public getViewForm() {
    return this._viewingForm;
  }

  public setSiteList(siteList: any) {
    this._siteList = siteList;
  }

  public getSiteList() {
    return this._siteList;
  }

  public morphForm(tableSchema: any) {
    console.log('morphin',  JSON.stringify(tableSchema));

    const layout = [];
    const jsonSchema = {
      'type': 'object',
      'properties': {},
      'required': []
    };
    const actualSchema = tableSchema; // tableSchema['resources'][0]['schema'];
    for (const i in actualSchema.fields) {
      if (!i) { // I don't know why -> get linting error otherwise
        continue;
      }
      const field = actualSchema.fields[i];
      console.log('considering field: ' + field.name);
      let currentLayout = null;

      jsonSchema.properties[field.name] = {
        'type': field.type
      };

      // if we encounter a "site code", replace it with a dropdown of
      // site codes from the project description.
      if (field.name === 'Site Code'
        || (field.type && field.type === 'siteCode')
        || ('biosys' in field && 'type' in field['biosys'] && field['biosys']['type'] === 'siteCode')
      ) {
        const siteCodeList = [];
        for (const site in this._siteList) {
          if (site) {
            for (const key in this._siteList[site]) {
              if (key) {
                siteCodeList.push(key);
              }
            }
          }
        }
        console.log('sitecodes', JSON.stringify(siteCodeList));
        jsonSchema.properties[field.name]['enum'] = siteCodeList;
      }

      if (field['format'] != null) {
        jsonSchema.properties[field.name].format = field['format'];
      }

      if (field.type === 'datetime') {
        jsonSchema.properties[field.name].type = 'string';
        jsonSchema.properties[field.name].format = 'date-time';
      }
      if (field.type === 'date') {
        jsonSchema.properties[field.name].type = 'string';
        jsonSchema.properties[field.name].format = 'date';
      }
      if (field.type === 'time') {
        jsonSchema.properties[field.name].type = 'string';
        jsonSchema.properties[field.name].format = 'time';
      }
      if (field['constraints'] != null) {
        if (field.constraints['required'] === true) {
          jsonSchema.required.push(field.name);
        }
        if (field.constraints['enum'] != null) {
          jsonSchema.properties[field.name]['enum'] = [...field.constraints['enum']];
          // NOTE: the ... is deliberate: VLC
        }
        if (field.constraints['min'] != null) {
          jsonSchema.properties[field.name]['minimum'] = field.constraints['min'];
        }
        if (field.constraints['max'] != null) {
          jsonSchema.properties[field.name]['maximum'] = field.constraints['max'];
        }
      }
      if (field['title'] != null) {
        if (currentLayout === null) {
          currentLayout = { 'key': field.name };
        }
        currentLayout['title'] = field['title'];

      }
      if (field['description'] != null) {
        if (currentLayout === null) {
          currentLayout = {
            'key': field.name
          };
        }
        currentLayout['placeholder'] = field['description'];
      }
      if (currentLayout !== null) {
        layout.push(currentLayout);
      }
    }

    const rv =  {
      jsonSchema: jsonSchema,
      layout: layout
    };
    // console.log('morph', JSON.stringify(rv));
    return rv;
  }

  public set formEditData(data: any) {
    this._formEditData = data;
  }
  public get formEditData() {
    return this._formEditData;
  }

}
