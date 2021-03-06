import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SampleComponent } from './sample.component';
import { SampleEditComponent } from './sample-edit/sample-edit.component';
import { SampleDetailsComponent } from './sample-details/sample-details.component';
import { SampleCreateComponent } from './sample-create/sample-create.component';
import { GlobalService } from '../../global.service';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SampleComponent },
            { path: 'edit/:id', component: SampleEditComponent },
			{ path: 'details/:id', component: SampleDetailsComponent },
			{ path: 'create', component: SampleCreateComponent }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class SampleRoutingModule {

}