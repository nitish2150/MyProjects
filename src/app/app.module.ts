import { LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { PlusWorksHttp } from './core/setup/app.http';
import { AppComponent } from './app.component';
import { AuthGuard } from './services/auth.guard';
import { PlusworksRequestOptions} from './core/setup/app.request-options';
import { CoreModule } from './core/core.module';
import {NgxPaginationModule} from 'ngx-pagination';


import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    CoreModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    // AdminComponent,

  ],
  providers: [
    AuthGuard,
    { provide : RequestOptions, useClass: PlusworksRequestOptions },
    { provide : Http, useClass: PlusWorksHttp },
    { provide: LOCALE_ID, useValue: "en-US" }
  ],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
