import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { Router } from  '@angular/router';
import { userInfo } from 'os';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
const swal = require('sweetalert');
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  providers: [OrderService]
})
export class OrdersListComponent implements OnInit {

  loading = false;
  page: any;
  totalRec: any;
  orders = [];
  ordersBkp = [];
  

  constructor(private orderService:OrderService, private router: Router,private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.getOrders({userId: 18});
  }

  getOrderDetails(orderId) {
    this.router.navigateByUrl('/orders-detail/'+orderId);   
}

  getOrders(data) {
    this.spinnerService.show();
    // this.loading = true;
    this.orderService.getAllOrders().subscribe(
      (data: any) => {
        //this.loading = false;
        this.orders = data.orders;
        this.ordersBkp = data.orders;
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        // this.loading = false;
      }
    );
  }

  applyFilter(){
    var serachText  = $('#searchText').val()
    if(serachText){
      this.orders = this.flowFilter(this.ordersBkp, serachText.toLowerCase());
    } else {
      swal(`Alert`, `Please enter something to search`, 'error')
    }
    
  }


flowFilter(array, substr) {
    return _.filter(array, _.flow(
    _.identity,
    _.values,
    _.join,
    _.toLower,
    _.partialRight(_.includes, substr)
  ));
}

  resetFilter(){
    $('#searchText').val('')
    this.orders = this.ordersBkp;
  }

  
}
