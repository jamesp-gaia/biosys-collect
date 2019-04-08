import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ObservationPage } from './observation';
import { ComponentsModule } from '../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faSave } from '@fortawesome/free-regular-svg-icons';
@NgModule({
    declarations: [
        ObservationPage,
    ],
    imports: [
        IonicModule.forRoot(),
        RouterModule.forChild([{ path: '', component: ObservationPage }]),
        ComponentsModule,
        FontAwesomeModule
    ],
})
export class ObservationPageModule {
    constructor() {
        library.add(faTrashAlt, faSave);
    }
}
