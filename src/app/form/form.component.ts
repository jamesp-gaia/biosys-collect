import { Component, OnInit } from '@angular/core';

import { JsonPointer } from 'angular6-json-schema-form';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form',
  templateUrl: 'form.component.html',
})
export class FormComponent implements OnInit {

  temptorecompilt = true;
  liveFormData: any = {};
  formValidationErrors: any;
  formIsValid = null;
  submittedFormData: any = null;
  yourJsonSchema = null;

  constructor() {
    this.yourJsonSchema = {
      'schema': {
        'type': 'object',
        'title': 'Comment',
        'properties': {
          'name': {
            'title': 'Name',
            'type': 'string'
          },
          'email': {
            'title': 'Email',
            'type': 'string',
            'pattern': '^\\S+@\\S+$',
            'description': 'Email will be used for evil.'
          },
          'comment': {
            'title': 'Comment',
            'type': 'string',
            'maxLength': 20,
            'validationMessage': 'Don\'t be greedy!'
          }
        },
        'required': [
          'name',
          'email',
          'comment'
        ]
      },
      'form': [
        'name',
        'email',
        {
          'key': 'comment',
          'type': 'textarea',
          'placeholder': 'Make a comment'
        },
        {
          'type': 'submit',
          'style': 'btn-info',
          'title': 'OK'
        }
      ]
    };
  }

  ngOnInit() {
    console.log('form component loaded!');
  }

  onSubmit(data: any) {
    this.submittedFormData = data;
  }

  get prettySubmittedFormData() {
    return JSON.stringify(this.submittedFormData, null, 2);
  }

  onChanges(data: any) {
    this.liveFormData = data;
  }

  get prettyLiveFormData() {
    return JSON.stringify(this.liveFormData, null, 2);
  }

  isValid(isValid: boolean): void {
    this.formIsValid = isValid;
  }

  validationErrors(data: any): void {
    this.formValidationErrors = data;
  }

  get prettyValidationErrors() {
    if (!this.formValidationErrors) { return null; }
    const errorArray = [];
    for (const error of this.formValidationErrors) {
      const message = error.message;
      const dataPathArray = JsonPointer.parse(error.dataPath);
      if (dataPathArray.length) {
        let field = dataPathArray[0];
        for (let i = 1; i < dataPathArray.length; i++) {
          const key = dataPathArray[i];
          field += /^\d+$/.test(key) ? `[${key}]` : `.${key}`;
        }
        errorArray.push(`${field}: ${message}`);
      } else {
        errorArray.push(message);
      }
    }
    return errorArray.join('<br>');
  }



}
