import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { CategoryListComponent } from '../../category-list/category-list.component';
import { ProductListComponent } from '../../product-list/product-list.component';
import { OffersListComponent } from '../../offers-list/offers-list.component';
import { OrdersListComponent } from '../../orders-list/orders-list.component';
import { OrdersDetailComponent } from '../../orders-detail/orders-detail.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxPaginationModule,
    MatTooltipModule,
    MatDatepickerModule,
    ConfirmationPopoverModule.forRoot({confirmButtonType:'danger'}),
    MatNativeDateModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    CategoryListComponent,
    ProductListComponent,
    OffersListComponent,
    OrdersListComponent,
    OrdersDetailComponent,
  ],
  exports:[
    BsDropdownModule,
    ModalModule
    
  ]
  
})

export class AdminLayoutModule {}
