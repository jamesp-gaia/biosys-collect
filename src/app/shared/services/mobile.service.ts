import { Injectable } from '@angular/core';

// Something to hold global state that is needed across the app.

@Injectable()
export class MobileService {
  private _projects: any; // TODO: make interface
  private _offline;

  constructor() {}

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
}
