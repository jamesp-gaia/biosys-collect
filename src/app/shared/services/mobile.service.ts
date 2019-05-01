import { Inject, Injectable } from '@angular/core';
import { APIService } from '../../biosys-core/services/api.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../../biosys-core/interfaces/api.interfaces';
import { HttpClient, HttpHeaders } from '../../../../node_modules/@angular/common/http';

// Something to hold global state that is needed across the app.

@Injectable()
export class MobileService extends APIService {
  private _projects: any; // TODO: make interface
  private _offline;
  private _projectCurrent: any;

  private _forms: Array<any> = [];

  constructor(@Inject(HttpClient) httpClient) {
    super(httpClient);
  }

  public get offline(): boolean {
    return this._offline || false;
  }
  public set offline(state: boolean) {
    this._offline = state;
    localStorage.setItem('offline', this._offline);
  }
  public offlineToggle() {
    this._offline = !this.offline;
    localStorage.setItem('offline', this._offline);
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
    return this.httpClient.get(
      this.buildAbsoluteUrl('forms/?dataset__project=' + project.id.toString(), false)
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
}
