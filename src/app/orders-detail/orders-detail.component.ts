import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { OrderService } from 'app/services/order.service';
import { DatePipe, Location } from '@angular/common';
import { DataService } from '../services/data.service';
const swal = require('sweetalert');
declare var $: any;
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.css'],
  providers: [DatePipe, OrderService, DataService],
})
export class OrdersDetailComponent implements OnInit {
  orderId=null;
  currentUser = null;
  orderDetails: any;
  loading= false; 
  userId = null;
  orderProducts = [];
  address="";
  baseUrl=null;
  selectedStatus = null;
  isShow = false;

  constructor(private datePipe: DatePipe,private router: Router,private route: ActivatedRoute, private orderService: OrderService,private location: Location,
    private data:DataService,private spinnerService: Ng4LoadingSpinnerService) { 
    this.currentUser = JSON.parse(sessionStorage.getItem('userDetails'));
    this.baseUrl = this.data.getBaseUrl();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];              
    }); 
    this.userId = this.currentUser.id;
    this.getOrderDetails()
  }

  goBack() {
    this.location.back(); // go back to previous location
  }

  getOrderDetails(){
   
    this.spinnerService.show();
        // this.loading = true;
    this.orderService.getOrderDetails(this.orderId,this.userId).subscribe(
      (data: any) => {
        this.spinnerService.show();
        //    this.loading = true;
        this.orderDetails = data;
        this.orderProducts = data.products
        if(data.orderStatus === 'DELIVERED' || data.orderStatus === 'CANCELED' || data.orderStatus === 'COMPLETE'){
          this.isShow = false;
        } else {
          this.isShow = true;
        }
        this.address = data.address.address+", "+ data.address.city+", "+ data.address.state+", "+data.address.country +" - "+ data.address.pincode
      },
      error => {
        this.spinnerService.hide();
        //   this.loading = false;
      }
    );
  }
  
  dateFormatter(date){
    return  this.datePipe.transform(date ,"d-MMM-y h:mm:ss a");
  }

  selectStatus(value) {
    this.selectedStatus = value;
  }

  updateStatus(){
      if(!this.selectedStatus){
        swal('alert', 'Please select status', 'error');
      } else {
        this.spinnerService.show();
        // this.loading = true;
        this.orderService.updateStatus({id: this.orderId, status: this.selectedStatus}).subscribe(
          (data: any) => {
            this.spinnerService.show();
            // this.loading = true;
            this.data.showNotification('success', data.message)
            this.hideModal()
          },
          error => {
            this.spinnerService.hide();
            //   this.loading = false;
          }
        );
      }
  }

  hideModal(){
    $("#change-status").modal("hide");   
    $("#change-status").val('')
    this.selectedStatus = null;
    this.navigateTo('order-list')
  }

  imageUrlFormater(imagePath){
    var url = this.baseUrl;
    return url.substr(0,url.lastIndexOf('/')) +imagePath;
  }

  navigateTo(key){
    if(key ==='dahsboard'){
      this.router.navigateByUrl('/dashboard');   
    } else if(key === 'order-list'){
      this.router.navigateByUrl('/orders-list');   
    }
    
  }
}
