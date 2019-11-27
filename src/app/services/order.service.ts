import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const swal = require('sweetalert');
@Injectable()

export class OrderService {

    data: Object;
    loading: boolean;

    constructor(private http: Http) { }

    getOrders(data) {
      return this.http.post('order/list', data)
        .map((response: Response) => {
          return response.json();
        }).catch(this.handleErrorObservable);
    }

    getAllOrders() {
      var url = 'order/all';
      
      return this.http.get(url).map((response: Response) => {
          return response.json();
        }).catch(this.handleErrorObservable);
    }

    getPendingOrders() {
      var url = 'order/pending';
      
      return this.http.get(url).map((response: Response) => {
          return response.json();
        }).catch(this.handleErrorObservable);
    }
    
    

    getOrderDetails(orderId: string, userId: string) {
        var url = 'order/'+orderId+'/'+userId
        
        return this.http.get(url).map((response: Response) => {
            return response.json();
          }).catch(this.handleErrorObservable);
    }


    updateStatus(data) {
      return this.http.post('order/statusUpdate', data)
        .map((response: Response) => {
          return response.json();
        }).catch(this.handleErrorObservable);
     }
    
    private handleErrorObservable(error: Response | any) {
        var res = JSON.parse(error._body)
        return swal(`${res.status}`, `${res.message}`, 'error');

      }

}