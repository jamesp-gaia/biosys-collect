import { Inject, Injectable } from '@angular/core';
import { APIService } from '../../biosys-core/services/api.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Something to hold global state that is needed across the app.

@Injectable()
export class MobileService extends APIService {
  private _projects: any; // TODO: make interface

  private _offline: boolean;

  private _projectCurrent: any;

  private _forms: Array<any> = [];

  private _viewingForm: any;

  constructor(@Inject(HttpClient) httpClient) {
    super(httpClient);
    this._offline = false;
  }

  public get offline(): boolean {
    return this._offline || false;
  }
  public set offline(state: boolean) {
    this._offline = state;
    // localStorage.setItem('offline', this._offline.toString());
  }
  public offlineToggle() {
    this._offline = !this.offline;
    // localStorage.setItem('offline', this._offline.toString());
    return this._offline;
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
    // this.buildAbsoluteUrl('forms/?dataset__project=' + project.id.toString(), false)
    return this.httpClient.get(
      this.buildAbsoluteUrl('form-hierarchy/?project=' + project.id.toString(), false)
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

  public getForm2(tableSchema: any) {
    const jsonSchema = {
      'type': 'object',
      'properties': {},
      'required': []
    };

    const layout = [];

    // const actualSchema = tableSchema['resources'][0]['schema'];
    const actualSchema = tableSchema;

    for (const i of actualSchema.fields) {
      if (i == null) {
        continue;
      }

      const field = i;
      console.log('considering field: ' + field.name);
      let currentLayout = null;
      jsonSchema.properties[field.name] = {
        'type': field.type

      };
      if (field['format'] != null) {
        jsonSchema.properties[field.name].format = field['format'];

      }
      if (field.type === 'datetime') {
        jsonSchema.properties[field.name].type = 'string';
        jsonSchema.properties[field.name].format = 'date-time';
      }
      if (field['constraints'] != null) {
        if (field.constraints['required'] === true) {
          jsonSchema.required.push(field.name);
        }
        if (field.constraints['enum'] != null) {
          jsonSchema.properties[field.name]['enum'] = [...field.constraints['enum']];
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
          currentLayout = {'key': field.name};
        }
        currentLayout['title'] = field['title'];

      }
      if (field['description'] != null) {
        if (currentLayout === null) {
          currentLayout = {'key': field.name};
        }
        currentLayout['placeholder'] = field['description'];
      }

      if (currentLayout !== null) {
        layout.push(currentLayout);
      }
    }

    console.log('final schema:');
    console.log(JSON.stringify(jsonSchema));
    return jsonSchema;
  }
}
