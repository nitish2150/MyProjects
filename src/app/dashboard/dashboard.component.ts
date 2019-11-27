import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as _ from 'lodash';
import { OrderService } from 'app/services/order.service';
import { DashboardService } from 'app/services/dashboard.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [OrderService, DashboardService, DatePipe]
})
export class DashboardComponent implements OnInit {
  loading = false;
  orders = [];
  categoryCount= 0;
  productCount=0 ;
  offerCount=0;
  orderCount=0;
  pendingOrdersCount : number;
  page: number = 1;
  

  constructor(private spinnerService: Ng4LoadingSpinnerService, private datePipe:DatePipe, private orderService:OrderService, private dashboardService:DashboardService, private router: Router,) { 

  }
  
  ngOnInit() {
    this.getCounts();
    this.getOrders();
  }

  getCounts() {
    var me = this;
    me.spinnerService.show();
    //me.loading = true;
    me.dashboardService.getCounts().subscribe(
      (data: any) => {
        this.spinnerService.show();
        // this.loading = true;
        _.each(data, function(counts) {
            if(counts.product){
              me.productCount =  parseInt(counts.product)
            } else if(counts.category){
              me.categoryCount = parseInt(counts.category)
            } else if(counts.offer){
              me.offerCount = parseInt(counts.offer)
            } else if(counts.orders){
              me.orderCount = parseInt(counts.orders)
            }
        });
      },
      error => {
        this.spinnerService.hide();
        //  this.loading = false;
      }
    );
  }

  getOrderDetails(orderId) {
    this.router.navigateByUrl('/orders-detail/'+orderId);   
  }

  getOrders() {
   // this.loading = true;
   this.spinnerService.show();
    this.orderService.getPendingOrders().subscribe(
    // this.orderService.getAllOrders().subscribe(
      (data: any) => {
        this.spinnerService.hide();
        // this.loading = false;
        this.orders = data.orders;
        this.pendingOrdersCount = this.orders.length;
      },
      error => {
        this.spinnerService.hide();
        //  this.loading = false;
      }
    );
  }

  redirectTo(){
    var type
    if(type === 'category'){
      this.router.navigateByUrl('/category-list');
    } else if(type === 'product'){
      this.router.navigateByUrl('/product-list');
    } else if(type === 'offer') {
      this.router.navigateByUrl('/offers-list');
    } else if(type === 'order'){
      this.router.navigateByUrl('/orders-list');
    }
    
  }

  dateFormatter(){
    return  this.datePipe.transform(new Date() ,"d MMM, y");
  }

}
