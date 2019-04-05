import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CensusPage } from './census';
import { ComponentsModule } from '../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faSave } from '@fortawesome/free-regular-svg-icons';

@NgModule({
    declarations: [
        CensusPage,
    ],
    imports: [
        IonicModule.forRoot(),
        RouterModule.forChild([{ path: '', component: CensusPage }]),
        ComponentsModule,
        FontAwesomeModule
    ],
    entryComponents: [
        CensusPage
    ]
})
export class CensusPageModule {
    constructor() {
        library.add(faTrashAlt, faSave);
    }
}
