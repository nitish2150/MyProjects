import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
//import { MaterialModule } from '@angular/material';

import { HttpService } from './http.service';
import { httpServiceFactory } from '../_factories/http-service.factory';
import { AngularReduxRequestOptions } from './angular-redux-request.options';
import { LoaderService } from './loader/loader.service';
import { LoaderComponent } from './loader/loader.component';
import { DataService } from '../services/data.service'

@NgModule({
    imports: [
        HttpModule,
    ],
    providers: [
        DataService,
        LoaderService,
        {
            provide: HttpService,
            useFactory: httpServiceFactory,
            deps: [XHRBackend, RequestOptions, LoaderService ]    
        }
    ],
    declarations: [
        LoaderComponent
    ],
    exports: [
        LoaderComponent
    ]
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        //  throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
