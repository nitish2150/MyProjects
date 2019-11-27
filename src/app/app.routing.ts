import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
// import { AdminComponentAdminComponent } from './admin/admin.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes =[
  
    //{ path: 'login', pathMatch: 'full', redirectTo: 'login'},
  { path: '', component: LoginComponent},
  { 
    path: 'dashboard',
    redirectTo: 'dashboard',     //
    pathMatch: 'full', 
    canActivate: [AuthGuard] 
    
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
       canActivate: [AuthGuard] 
    }]
  },
  { path: '**', redirectTo: 'dashboard' }
];
/*
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent },
 // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
 // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
 { path: 'admin-layout', component: AdminLayoutComponent, canActivate: [AuthGuard],
 //children: [{
  //path: '',
  //loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
}//] },

];*/

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
/*
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})*/

export class AppRoutingModule { }
