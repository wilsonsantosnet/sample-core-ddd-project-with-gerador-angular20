import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SampleTypeComponent } from './sampletype.component';
import { SampleTypeEditComponent } from './sampletype-edit/sampletype-edit.component';
import { SampleTypeDetailsComponent } from './sampletype-details/sampletype-details.component';
import { SampleTypeCreateComponent } from './sampletype-create/sampletype-create.component';
import { GlobalService } from '../../global.service';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SampleTypeComponent },
            { path: 'edit/:id', component: SampleTypeEditComponent },
			{ path: 'details/:id', component: SampleTypeDetailsComponent },
			{ path: 'create', component: SampleTypeCreateComponent }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class SampleTypeRoutingModule {

}