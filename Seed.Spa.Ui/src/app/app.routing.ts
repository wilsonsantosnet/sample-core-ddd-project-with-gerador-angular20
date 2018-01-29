import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';


const APP_ROUTES_DEFAULT: Routes = [

	{
        path: '', component: MainComponent, children: [

            { path: 'sample', loadChildren: './main/sample/sample.module#SampleModule' },
            { path: 'sampletype', loadChildren: './main/sampletype/sampletype.module#SampleTypeModule' },


		    ]
    },

    { path: 'sample/print/:id', loadChildren: './main/sample/sample-print/sample-print.module#SamplePrintModule' },
    { path: 'sampletype/print/:id', loadChildren: './main/sampletype/sampletype-print/sampletype-print.module#SampleTypePrintModule' },

]


export const RoutingDefault: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES_DEFAULT);


