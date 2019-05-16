import { Component, OnInit } from '@angular/core';
import { MobileService } from '../shared/services/mobile.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.page.html',
  styleUrls: ['./form-viewer.page.scss'],
})
export class FormViewerPage implements OnInit {
  public formSchema: any;
  private liveFormData: any = {};
  private formValidationErrors: any;
  private formIsValid = null;
  private submittedFormData: any = null;

  private yourJsonSchema = {
    'name': 'Testy Test',
    'layout': {
      'schema': {
        'type': 'object',
        'title': 'This is a test',
        'properties': {
          'IndDetectionID': {
            'title': 'IndDetectionID',
            'type': 'number',
            'description': 'IndDetectionID Desc',
          },
          'SpeciesID': {
            'title': 'SpeciesID',
            'type': 'number',
            'description': 'SpeciesID desc'
          },
          'Species': {
            'type': 'string',
            'title': 'Species Test',
            'enum': [
              'A',
              'B',
              'C'
            ],
            'description': 'Species Desc'
          }
        },
        'required': [
          'IndDetectionID',
        ],
        'form': [
          {
            'key': 'IndDetectionID',
            'placeholder': 'IndDetectionID placeholder',
            'title': 'IndDet Title',
            'label': 'HelloInd',
          },
          {
            'title': 'Species ID Title',
            'label': 'Hello',
            'key': 'SpeciesID',
            'placeholder': 'Species ID Placeholder'
          },
          'Species'
        ]
      }
    }
  };

  private dataToFormSchemaSchema = {
    'profile': 'tabular-data-package',
    'name': 'koala-scat-census',
    'resources': [
      {
        'profile': 'tabular-data-resource',
        'name': 'klm-sat-census',
        'encoding': 'utf-8',
        'format': 'csv',
        'mediatype': 'text/csv',
        'path': 'tmp7kgle969.upload',
        'schema': {
          'fields': [
            {
              'constraints': {
                'required': true
              },
              'type': 'string',
              'name': 'Census ID',
              'format': 'default'
            },
            {
              'description': 'Unique site identifier',
              'format': 'default',
              'title': 'Site ID',
              'constraints': {
                'required': true
              },
              'type': 'string',
              'name': 'SiteNo'
            },
            {
              'constraints': {
                'enum': [
                  'Koala Pilot Project'
                ],
                'required': true
              },
              'type': 'string',
              'name': 'Survey Name',
              'format': 'default'
            },
            {
              'description': 'Date of census',
              'format': 'any',
              'biosys': {
                'type': 'observationDate'
              },
              'constraints': {
                'required': true
              },
              'type': 'datetime',
              'name': 'Start Date and time'
            },
            {
              'description': 'End of census',
              'constraints': {
                'required': true
              },
              'type': 'datetime',
              'name': 'End Date and time',
              'format': 'any'
            },
            {
              'constraints': {
                'required': true
              },
              'type': 'string',
              'name': 'Census Observers',
              'format': 'default'
            },
            {
              'constraints': {
                'enum': [
                  'WGS84'
                ],
                'required': true
              },
              'type': 'string',
              'name': 'Datum',
              'format': 'default'
            },
            {
              'description': 'Latitude of the SAT start tree',
              'format': 'default',
              'biosys': {
                'type': 'latitude'
              },
              'constraints': {
                'max': -20,
                'required': true,
                'min': -40
              },
              'type': 'number',
              'name': 'Latitude'
            },
            {
              'description': 'Longitude of the SAT start tree',
              'format': 'default',
              'biosys': {
                'type': 'longitude'
              },
              'constraints': {
                'max': 162,
                'required': true,
                'min': 138
              },
              'type': 'number',
              'name': 'Longitude'
            },
            {
              'description': 'How accurately the coordinates represent the exact location of the species (in metres, up to 4 decimal places).',
              'format': 'default',
              'title': 'Accuracy (metres)',
              'constraints': {
                'required': true,
                'min': 0
              },
              'type': 'number',
              'name': 'Accuracy'
            },
            {
              'description': 'Whole number between 0 and 2500 (in metres).',
              'format': 'default',
              'title': 'Altitude (metres)',
              'constraints': {
                'max': 2500,
                'required': true,
                'min': 0
              },
              'type': 'integer',
              'name': 'Altitude'
            },
            {
              'constraints': {
                'enum': [
                  'Aboriginal Area',
                  'CCA Zone 1 National Park',
                  'CCA Zone 2 Aboriginal Area',
                  'CCA Zone 3 State Conservation Area',
                  'Conservation Agreement',
                  'Council Reserve',
                  'Council Reserve (LGA)',
                  'Crown Leasehold',
                  'Crown Leasehold (Travelling Stock Route)',
                  'Enclosure Permit',
                  'Flora Reserve',
                  'Freehold',
                  'Game Reserve',
                  'Historic Site',
                  'Indigenous Managed Property',
                  'Indigenous Protected Area',
                  'Karst Conservation Reserve',
                  'Leasehold',
                  'Military Land',
                  'National Park',
                  'Nature Reserve',
                  'Other',
                  'Private Property',
                  'Proposal Abandoned',
                  'Proposal, Category Undetermined',
                  'Proposed Aboriginal Area',
                  'Proposed Game Reserve',
                  'Proposed Historic Site',
                  'Proposed National Park',
                  'Proposed Nature Reserve',
                  'Proposed State Recreation Area',
                  'Proposed Wildlife Management Area',
                  'Proposed Wildlife Reserve',
                  'Regional Park',
                  'Road Reserve',
                  'State Conservation Area',
                  'State Forest',
                  'State Park',
                  'State Recreation Area',
                  'Travelling Stock Reserve',
                  'Vacant Crown Land',
                  'Water Catchment Area',
                  'Western Lands Lease',
                  'Wildlife Management Area',
                  'Wildlife Refuge'
                ]
              },
              'type': 'string',
              'name': 'Tenure',
              'format': 'default'
            },
            {
              'type': 'string',
              'name': 'Property/ Reserve name',
              'format': 'default'
            },
            {
              'description': 'Detailed description of the geographic location, such as street, nearest cross street, town, landmark or reserve.',
              'constraints': {
                'required': false
              },
              'type': 'string',
              'name': 'Location Description',
              'format': 'default'
            },
            {
              'constraints': {
                'enum': [
                  'Koala SAT Survey'
                ],
                'required': true
              },
              'type': 'string',
              'name': 'Census Type',
              'format': 'default'
            },
            {
              'description': 'e.g. how the start tree was selected, the grid size if applicable, predefined search distance and time for each tree searched',
              'type': 'string',
              'name': 'Census method notes',
              'format': 'default'
            },
            {
              'description': 'Did you take a photograph of the site?',
              'constraints': {
                'enum': [
                  'Yes',
                  'No'
                ]
              },
              'type': 'string',
              'name': 'Site photos',
              'format': 'default'
            },
            {
              'description': 'Did you take scat samples for external analysis?',
              'constraints': {
                'enum': [
                  'Yes',
                  'No'
                ]
              },
              'type': 'string',
              'name': 'Scat samples',
              'format': 'default'
            },
            {
              'description': 'Did you take tree and/or scat specimens for ID verification?',
              'constraints': {
                'enum': [
                  'Yes',
                  'No'
                ]
              },
              'type': 'string',
              'name': 'Tree specimens',
              'format': 'default'
            }
          ],
          'primaryKey': 'Census ID',
          'missingValues': [
            ''
          ]
        }
      }
    ],
    'title': 'Koala Scat Census'
  };

  private validationErrorToDisplay = '';
  public jsonSchema = {};
  public jsonSchemaString = {};
  public layoutSchema = {};

  public jsonSchemaFake =
    {
      'type': 'object',
      'properties': {
        'Census ID': {
          'type': 'string',
          'format': 'default' },
        'SiteNo': {
          'type': 'string',
          'format': 'default' },
        'EntryOrder': {
          'type': 'integer',
          'format': 'default',
          'enum': ['A']
        },
        'DateFirst': {
          'type': 'string',
          'format': 'date-time'
        },
        'DateLast': {
          'type': 'string',
          'format': 'date-time',
          'enum': ['AA'] },
        'SubplotID': {
          'type': 'string',
          'format': 'default',
          'enum': ['AAA'] },
        'Type': {
          'type': 'string',
          'format': 'default',
          'enum': ['FL'] },
        'ScientificName': {
          'type': 'string',
          'enum': [
            'Acacia spp.',
            'Acmena smithii',
            'Allocasuarina littoralis',
            'Allocasuarina torulosa',
            'Alphitonia excelsa',
            'Angophora bakeri',
            'Angophora costata',
            'Angophora floribunda',
            'Angophora subvelutina',
            'Banksia spp.',
            'Brachychiton populneus',
            'Callitris columellaris',
          ]
        },
        'SpeciesCode': {
          'type': 'string',
          'format': 'default',
          'enum': [
            'ACAC',
            '3968',
            '2012'
          ]
        },
        'CommonName': {
          'type': 'string',
          'format': 'default',
          'enum': ['AS']
        },
        'DBH': {
          'type': 'integer',
          'format': 'default',
          'minimum': 0
        },
        'Koala Scat': {
          'type': 'string',
          'format': 'default',
          'enum': [
            'Yes',
            'No'
          ]
        },
        'Scat Age': {
          'type': 'string',
          'format': 'default',
          'enum': [
            '1',
            '2',
          ]
        },
        'Koala count': {
          'type': 'integer',
          'format': 'default',
          'minimum': 0
        },
        'Tree Notes': {
          'type': 'string',
          'format': 'default'
        },
        'Koala/ Scat notes': {
          'type': 'string',
          'format': 'default'
        }
      },
      'required': [
        'Census ID',
        'SiteNo',
        'DateFirst',
        'Type',
        'ScientificName',
        'SpeciesCode'
      ]
    };

  public layoutSchemaFake = {
    'schema': {
      'required': ['IndDetectionID'],
      'type': 'object',
      'properties': {
        'SpeciesID': { 'type': 'number', 'description': 'SpeciesID desc', 'title': 'SpeciesID' },
        'IndDetectionID': { 'type': 'number', 'description': 'IndDetectionID Desc', 'title': 'IndDetectionID' },
        'Species': { 'enum': ['A', 'B', 'C'], 'type': 'string', 'description': 'Species Desc', 'title': 'Species Test' }
      },
      'form': [{
        'title': 'IndDet Title',
        'placeholder': 'IndDetectionID placeholder',
        'key': 'IndDetectionID',
        'label': 'HelloInd'
      }, { 'title': 'Species ID Title', 'placeholder': 'Species ID Placeholder', 'key': 'SpeciesID', 'label': 'Hello' }, 'Species'],
      'title': 'This is a test'
    }
  };

  constructor(private mobileService: MobileService, private router: Router, private pageLocation: Location) {
    // const formSchema = mobileService.getViewForm(); // || this.yourJsonSchema;
    // this.layoutSchema = formSchema.layout;
    // console.log('layoutschema', JSON.stringify(this.layoutSchema));
    // this.jsonSchema = mobileService.getForm2(formSchema.table_schema);
    // this.jsonSchemaString = JSON.stringify(this.jsonSchema);
    // console.log('jsonschema', this.jsonSchemaString);
    return;
  }

  ngOnInit() {
  }


  onSubmit(data: any) {
    console.log('submitted', data);
    this.pageLocation.back();
    if (this.formIsValid) {
      this.submittedFormData = data;

      // TODO: patch sensor data in

      const dataPoint: any = {
        dataSetID: this.formSchema.dataset,
        formData: data,
      };

    } else {
      alert(this.validationErrorToDisplay);
    }
    return;
  }

  onChanges(data: any) {
    this.liveFormData = data;
  }

  isValid(isValid: boolean): void {
    this.formIsValid = isValid;
    console.log('isvalid', isValid);
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
}
