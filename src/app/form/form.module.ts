import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule,
  MatMenuModule, MatSelectModule, MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';




// To include JsonSchemaFormModule after downloading from NPM, use this instead:
//
//   import { JsonSchemaFormModule, NoFrameworkModule } from 'angular6-json-schema-form';
//
// but replace "NoFrameworkModule" with the framework you want to use,
// then import both JsonSchemaFormModule and the framework module, like this:
//
//   imports: [ ... NoFrameworkModule, JsonSchemaFormModule.forRoot(NoFrameworkModule) ... ]

import { FormComponent } from './form.component';

import {
  MaterialDesignFrameworkModule, Bootstrap4FrameworkModule,
  Bootstrap3FrameworkModule, NoFrameworkModule
} from 'angular6-json-schema-form';

@NgModule({
  declarations: [FormComponent],
  imports: [
    FormsModule,
    MatButtonModule, MatCardModule, MatCheckboxModule,
    MatIconModule, MatMenuModule, MatSelectModule, MatToolbarModule,
    RouterModule.forChild([
      {
        path: '',
        component: FormComponent
      },
    ]),
    MaterialDesignFrameworkModule,
    Bootstrap4FrameworkModule,
    Bootstrap3FrameworkModule,
    NoFrameworkModule
  ]
})

// Here, by loading 4 frameworks in JsonSchemaFormModule.forRoot(), the first,
// `NoFrameworkModule`, will be set active by default. But any of the 4 can
// be activated later by passing the framework's name to the <json-schema-form>
// tag's `framework` input. The names of these 4 frameworks are:
//   'no-framework'
//   'material-design-framework',
//   'bootstrap-3-framework'
//   'bootstrap-4-framework'

export class FormModule { }
